document.addEventListener("DOMContentLoaded", () => {
  const latitude = 40.7128; // Default latitude (New York)
  const longitude = -74.0060; // Default longitude (New York)

  async function fetchMoonPhase(lat, lon) {
    const apiKey = '0c410d09208b73d2b9154ec79b76a07d'; // OpenWeatherMap API key

    try {
      // Fetch weather data
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`;
      console.log(`Fetching moon phase data from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Moon phase data:', data);

      // Extract moon data
      const today = data.daily[0];
      const moonPhase = today.moon_phase; // Value between 0 and 1
      const moonrise = new Date(today.moonrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const moonset = new Date(today.moonset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Determine moon phase image
      let moonPhaseImage = '';
      if (moonPhase === 0 || moonPhase === 1) {
        moonPhaseImage = 'new_moon.png';
      } else if (moonPhase > 0 && moonPhase < 0.25) {
        moonPhaseImage = 'waxing_crescent.png';
      } else if (moonPhase === 0.25) {
        moonPhaseImage = 'first_quarter.png';
      } else if (moonPhase > 0.25 && moonPhase < 0.5) {
        moonPhaseImage = 'waxing_gibbous.png';
      } else if (moonPhase === 0.5) {
        moonPhaseImage = 'full_moon.png';
      } else if (moonPhase > 0.5 && moonPhase < 0.75) {
        moonPhaseImage = 'waning_gibbous.png';
      } else if (moonPhase === 0.75) {
        moonPhaseImage = 'last_quarter.png';
      } else if (moonPhase > 0.75 && moonPhase < 1) {
        moonPhaseImage = 'waning_crescent.png';
      }

      // Update the Moon Phase window
      const moonPhaseElement = document.getElementById('moon-phase');
      if (moonPhaseElement) {
        moonPhaseElement.innerHTML = `
          <img src="assets/images/moonphases/${moonPhaseImage}" alt="Moon Phase" style="width: 100px; height: 100px;" />
          <p>Moon Phase: ${getMoonPhaseName(moonPhase)}</p>
          <p>Moonrise: ${moonrise}</p>
          <p>Moonset: ${moonset}</p>
        `;
        console.log('Moon phase updated successfully.');
      }
    } catch (error) {
      console.error('Error fetching moon phase data:', error);

      const moonPhaseElement = document.getElementById('moon-phase');
      if (moonPhaseElement) {
        moonPhaseElement.innerHTML = `<p>Error loading moon phase data.</p>`;
      }
    }
  }

  // Helper function to get the moon phase name
  function getMoonPhaseName(moonPhase) {
    if (moonPhase === 0 || moonPhase === 1) {
      return 'New Moon';
    } else if (moonPhase > 0 && moonPhase < 0.25) {
      return 'Waxing Crescent';
    } else if (moonPhase === 0.25) {
      return 'First Quarter';
    } else if (moonPhase > 0.25 && moonPhase < 0.5) {
      return 'Waxing Gibbous';
    } else if (moonPhase === 0.5) {
      return 'Full Moon';
    } else if (moonPhase > 0.5 && moonPhase < 0.75) {
      return 'Waning Gibbous';
    } else if (moonPhase === 0.75) {
      return 'Last Quarter';
    } else if (moonPhase > 0.75 && moonPhase < 1) {
      return 'Waning Crescent';
    }
    return 'Unknown Phase';
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
