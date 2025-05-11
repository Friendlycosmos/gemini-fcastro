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

    const hero = container.parentElement;
    const heroRect = hero.getBoundingClientRect();
    const width = heroRect.width;
    const height = heroRect.height;

    const star = document.createElement('div');
    const isLTR = Math.random() > 0.5;

    let startX, startY, endX, endY, angle;
    if (isLTR) {
      // Left to right: start at left edge, end at right edge, random Y for both
      startX = 0;
      endX = width;
      startY = Math.random() * height;
      endY = Math.random() * height;
      angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
      star.className = 'shooting-star ltr';
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      star.style.setProperty('--angle', `${angle}deg`);
      star.style.setProperty('--move-x', `${endX - startX}px`);
      star.style.setProperty('--move-y', `${endY - startY}px`);
      star.style.animationName = 'shooting-star-move-ltr';
    } else {
      // Right to left: start at right edge, end at left edge, random Y for both
      startX = width;
      endX = 0;
      startY = Math.random() * height;
      endY = Math.random() * height;
      angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
      star.className = 'shooting-star rtl';
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      star.style.setProperty('--angle', `${angle}deg`);
      star.style.setProperty('--move-x', `${endX - startX}px`);
      star.style.setProperty('--move-y', `${endY - startY}px`);
      star.style.animationName = 'shooting-star-move-rtl';
    }

    // Force reflow to ensure animation triggers
    void star.offsetWidth;

    container.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 1800);
  }

  setInterval(() => {
    if (Math.random() > 0.3) createShootingStar();
  }, 2200);
});
