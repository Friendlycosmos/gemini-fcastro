document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero');
  const images = [
    'assets/images/hero/image1.png',
    'assets/images/hero/image2.png',
    'assets/images/hero/image3.png',
    'assets/images/hero/image4.png',
    'assets/images/hero/image5.png',
    'assets/images/hero/image6.png'
  ];
  let currentIndex = 0;

  // Create crossfade overlay div if not present
  let crossfadeDiv = hero.querySelector('.hero-crossfade');
  if (!crossfadeDiv) {
    crossfadeDiv = document.createElement('div');
    crossfadeDiv.className = 'hero-crossfade';
    hero.insertBefore(crossfadeDiv, hero.firstChild);
  }

  // Set initial background
  hero.style.backgroundImage = `url('${images[currentIndex]}')`;

  function crossfadeToNextImage() {
    const nextIndex = (currentIndex + 1) % images.length;
    crossfadeDiv.style.backgroundImage = `url('${images[nextIndex]}')`;
    hero.classList.add('crossfading');
    // Start crossfade
    setTimeout(() => {
      hero.style.backgroundImage = `url('${images[nextIndex]}')`;
      hero.classList.remove('crossfading');
      currentIndex = nextIndex;
    }, 1200); // Match transition duration in CSS
  }

  setInterval(crossfadeToNextImage, 8000);

  function createShootingStar() {
    const container = document.getElementById('shooting-star-container');
    if (!container) return;

    const star = document.createElement('div');
    const isLTR = Math.random() > 0.5;

    // Angle: 55deg (shallow) to 80deg (steep)
    const angle = (Math.random() * 25) + 55;
    // Random vertical start position (10% to 80%)
    const startY = Math.random() * 70 + 10;

    star.className = 'shooting-star ' + (isLTR ? 'ltr' : 'rtl');

    if (isLTR) {
      star.style.left = '0%';
      star.style.top = `${startY}%`;
      star.style.setProperty('--angle', `${angle}deg`);
      // Calculate the Y offset for the end point based on the angle and hero width
      const hero = container.parentElement;
      const heroRect = hero.getBoundingClientRect();
      const width = heroRect.width;
      const height = heroRect.height;
      // tan(angle) = deltaY / width
      const radians = angle * Math.PI / 180;
      const deltaY = Math.tan(radians) * width;
      star.style.setProperty('--deltaY', `${deltaY}px`);
    } else {
      star.style.left = '100%';
      star.style.top = `${startY}%`;
      star.style.setProperty('--angle', `-${angle}deg`);
      const hero = container.parentElement;
      const heroRect = hero.getBoundingClientRect();
      const width = heroRect.width;
      const radians = angle * Math.PI / 180;
      const deltaY = Math.tan(radians) * width;
      star.style.setProperty('--deltaY', `${deltaY}px`);
    }

    container.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 1800);
  }

  // Increase frequency, as before
  setInterval(() => {
    if (Math.random() > 0.3) createShootingStar();
  }, 2200);
});
