document.addEventListener("DOMContentLoaded", () => {
  const astroEventsElement = document.getElementById("astro-events");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const updateLocationButton = document.getElementById("update-location");
  const detectLocationButton = document.getElementById("detect-location");

  let latitude = 40.7128; // Default: New York latitude
  let longitude = -74.0060; // Default: New York longitude

  async function fetchAstroEvents(lat, lon) {
    try {
      const url = `https://api.friendlycosmos.com/astro-events?lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Astronomical events data:', data);

      const astroEventsElement = document.getElementById('astro-events');
      if (astroEventsElement) {
        const eventsHtml = data.events
          .map((event) => `<p>${event.name} · ${event.time}</p>`)
          .join('');
        astroEventsElement.innerHTML = eventsHtml;
      }
    } catch (error) {
      console.error('Error fetching astronomical events:', error);
      const astroEventsElement = document.getElementById('astro-events');
      if (astroEventsElement) {
        astroEventsElement.innerHTML = `<p>Error loading astronomical events.</p>`;
      }
    }
  }

  function displayAstronomicalEvents() {
    const date = new Date();

    try {
      const sunTimes = SunCalc.getTimes(date, latitude, longitude);

      const formatTime = (time) => (time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A");

      astroEventsElement.innerHTML = `
        <p><strong>Sunrise:</strong> ${formatTime(sunTimes.sunrise)}</p>
        <p><strong>Sunset:</strong> ${formatTime(sunTimes.sunset)}</p>
        <p><strong>Nautical Twilight (Start):</strong> ${formatTime(sunTimes.nauticalDawn)}</p>
        <p><strong>Nautical Twilight (End):</strong> ${formatTime(sunTimes.nauticalDusk)}</p>
        <p><strong>Astronomical Twilight (Start):</strong> ${formatTime(sunTimes.nightEnd)}</p>
        <p><strong>Astronomical Twilight (End):</strong> ${formatTime(sunTimes.night)}</p>
        <p><strong>Night:</strong> ${formatTime(sunTimes.nadir)}</p>
      `;
    } catch (error) {
      console.error("Error calculating astronomical events:", error);
      astroEventsElement.innerHTML = `<p class="error">Unable to calculate astronomical events. Please check the console for details.</p>`;
    }
  }

  detectLocationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          latitudeInput.value = latitude.toFixed(4);
          longitudeInput.value = longitude.toFixed(4);
          console.log(`Detected location: Latitude: ${latitude}, Longitude: ${longitude}`);
          displayAstronomicalEvents(); // Update events after detecting location
        },
        (error) => {
          console.error("Error detecting location:", error);
          alert("Unable to detect your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });

  updateLocationButton.addEventListener("click", () => {
    const lat = parseFloat(latitudeInput.value);
    const lon = parseFloat(longitudeInput.value);

    if (!isNaN(lat) && !isNaN(lon)) {
      latitude = lat;
      longitude = lon;
      console.log(`Location updated to Latitude: ${latitude}, Longitude: ${longitude}`);
      displayAstronomicalEvents(); // Update events after manual location update
    } else {
      alert("Please enter valid latitude and longitude values.");
    }
  });

  // Display events for the default location on page load
  displayAstronomicalEvents();
});
