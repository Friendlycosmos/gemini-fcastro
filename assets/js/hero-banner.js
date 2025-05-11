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
});
