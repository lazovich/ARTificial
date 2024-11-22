  class Gallery {
    constructor() {
        this.currentIndex = 0;
        this.artworks = window.ARTWORKS_DATA.artworks;
        this.isTyping = false;
        this.typingPromise = null;
        
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => this.prev());
            nextButton.addEventListener('click', () => this.next());
        }
        
        this.display();
    }

    async loadData() {
        try {
            const response = await fetch('/assets/data/artworks.json');
            this.artworks = (await response.json()).artworks;
            this.display();
        } catch (error) {
            console.error('Error loading artwork data:', error);
        }
    }

    async typeText(element, text, speed = 5) {
      element.textContent = '';
      element.style.visibility = 'visible';
      for (let char of text) {
          if (!this.isTyping) break;
          element.textContent += char;
          await new Promise(resolve => setTimeout(resolve, speed));
      }
    } 

  async display() {
    this.isTyping = false;
    if (this.typingPromise) {
        await this.typingPromise;
    }
    
    this.isTyping = true;

    const artwork = this.artworks[this.currentIndex];
    const artworkImg = document.getElementById('artwork');
    if (artworkImg) {
        artworkImg.src = `${window.SITE_BASE_URL}/assets/images/${artwork.image}`;
    }
    
    const classificationDiv = document.getElementById('classification');
    if (!classificationDiv) return;
    
    classificationDiv.innerHTML = '';

    for (const [category, values] of Object.entries(artwork.classifications)) {
        if (!this.isTyping) break;
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'typing';
        classificationDiv.appendChild(categoryDiv);

        let text = `${category.toUpperCase()}:\n\n`;
        
        for (const [label, prob] of Object.entries(values)) {
            text += `${label}: ${createAsciiBar(prob)}\n\n`;
        }

        this.typingPromise = this.typeText(categoryDiv, text);
        await this.typingPromise;
    }
  }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.artworks.length;
        this.display();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.artworks.length) % this.artworks.length;
        this.display();
    }
  }

  function createAsciiBar(value, maxLength = 20) {
    const filled = Math.round(value * maxLength);
    return '[' + '█'.repeat(filled) + ' '.repeat(maxLength - filled) + '] ' + (value * 100).toFixed(1) + '%';
  }

  // Create gallery instance when DOM is loaded
  window.addEventListener('DOMContentLoaded', () => {
    window.gallery = new Gallery();
  });