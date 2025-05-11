document.addEventListener("DOMContentLoaded", () => {
  const latitude = 40.7128; // Default latitude (New York)
  const longitude = -74.0060; // Default longitude (New York)

  async function fetchMoonPhase(lat, lon) {
    try {
      const url = `https://api.friendlycosmos.com/moon-phase?lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Moon phase data:', data);

      const moonPhaseElement = document.getElementById('moon-phase');
      if (moonPhaseElement) {
        moonPhaseElement.innerHTML = `
          <p>${data.phase} · ${data.illumination}% visible · Best seen ${data.bestSeen}</p>
          <img src="${data.image}" alt="Moon Phase Image" />
        `;
      }
    } catch (error) {
      console.error('Error fetching moon phase data:', error);
      const moonPhaseElement = document.getElementById('moon-phase');
      if (moonPhaseElement) {
        moonPhaseElement.innerHTML = `<p>Error loading moon phase data.</p>`;
      }
    }
  }

  // Attach event listeners to update the moon phase when the location changes
  document.getElementById('update-location').addEventListener('click', () => {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);
    if (!isNaN(lat) && !isNaN(lon)) {
      fetchMoonPhase(lat, lon);
    } else {
      alert('Please enter valid latitude and longitude values.');
    }
  });

  document.getElementById('detect-location').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchMoonPhase(lat, lon);
        },
        (error) => {
          console.error('Error detecting location:', error);
          alert('Unable to detect location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  });

  fetchMoonPhase(latitude, longitude);
});
