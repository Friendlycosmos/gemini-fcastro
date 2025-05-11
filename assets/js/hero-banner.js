document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero');
  const backgrounds = [
    'assets/images/hero/image1.png',
    'assets/images/hero/image2.png',
    'assets/images/hero/image3.png',
    'assets/images/hero/image4.png',
    'assets/images/hero/image5.png',
    'assets/images/hero/image6.png'
  ];
  let index = 0;

  function rotateBackground() {
    const nextIndex = (index + 1) % backgrounds.length;

    // Set the ::before pseudo-element's background to the next image
    hero.style.setProperty('--next-background', `url(${backgrounds[nextIndex]})`);

    // Trigger the crossfade
    hero.classList.add('crossfade');
    setTimeout(() => {
      // Update the main background after the crossfade
      hero.style.backgroundImage = `url(${backgrounds[nextIndex]})`;
      hero.classList.remove('crossfade');
      index = nextIndex;
    }, 1500); // Match the transition duration
  }

  // Initialize the first background
  hero.style.backgroundImage = `url(${backgrounds[index]})`;

  // Rotate every 10 seconds
  setInterval(rotateBackground, 10000);
});
