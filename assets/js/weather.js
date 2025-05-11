document.addEventListener("DOMContentLoaded", () => {
  const weatherDataElement = document.getElementById("weather-data");
  const weatherForecastElement = document.getElementById("weather-forecast");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const moonPhaseElement = document.getElementById("moon-phase");
  const hourlyForecastContent = document.getElementById("hourly-forecast-content");
  const hourlyForecastModal = document.getElementById("hourly-forecast-modal");
  const closeHourlyForecastButton = document.getElementById("close-hourly-forecast");
  const weatherAlertsElement = document.getElementById("weather-alerts");

  let latitude = 40.7128; // Default: New York latitude
  let longitude = -74.0060; // Default: New York longitude

  const updateLocationButton = document.getElementById('update-location');
  const detectLocationButton = document.getElementById('detect-location');

  if (updateLocationButton) {
    updateLocationButton.addEventListener('click', () => {
      const lat = parseFloat(document.getElementById('latitude').value);
      const lon = parseFloat(document.getElementById('longitude').value);
      if (!isNaN(lat) && !isNaN(lon)) {
        fetchWeatherData(lat, lon);
      } else {
        alert('Please enter valid latitude and longitude values.');
      }
    });
  }

  if (detectLocationButton) {
    detectLocationButton.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('latitude').value = lat.toFixed(4);
            document.getElementById('longitude').value = lon.toFixed(4);
            fetchWeatherData(lat, lon);
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
  }

  async function fetchWeatherData(lat, lon) {
    const apiKey = '0c410d09208b73d2b9154ec79b76a07d'; // OpenWeatherMap API key

    try {
      // Fetch weather data
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}`;
      console.log(`Fetching weather data from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Weather data:', data);

      // Debug: Check if hourly data exists
      if (!data.hourly || data.hourly.length === 0) {
        console.error('Hourly data is missing or empty.');
      }

      // Update location display
      const locationUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
      const locationResponse = await fetch(locationUrl);
      if (!locationResponse.ok) {
        throw new Error(`Location API Error: ${locationResponse.statusText}`);
      }
      const locationData = await locationResponse.json();
      const locationName = `${locationData[0]?.name || 'Unknown'}, ${locationData[0]?.country || 'Unknown'}`;

      const weatherLocationElement = document.getElementById('weather-location');
      if (weatherLocationElement) {
        weatherLocationElement.innerHTML = `<p>Weather for: <strong>${locationName}</strong></p>`;
      }

      // Update hourly forecast summary in the weather forecast window
      const hourlyForecastElement = document.getElementById('hourly-forecast');
      if (hourlyForecastElement) {
        const firstHour = data.hourly[0];
        const tempC = (firstHour.temp - 273.15).toFixed(1);
        const tempF = ((firstHour.temp - 273.15) * 9/5 + 32).toFixed(1);
        hourlyForecastElement.innerHTML = `
          <p>First Hour: ${tempC}°C / ${tempF}°F</p>
          <p>Click a day to view the full hourly forecast.</p>
        `;
        console.log('Hourly forecast summary updated in the weather forecast window.');
      }

      // Update daily forecast
      const dailyForecastElement = document.getElementById('daily-forecast');
      if (dailyForecastElement) {
        const dailyHtml = data.daily
          .slice(0, 7) // Limit to 7 days
          .map((day, index) => {
            const date = new Date(day.dt * 1000).toLocaleDateString();
            const dayTempC = (day.temp.day - 273.15).toFixed(1);
            const dayTempF = ((day.temp.day - 273.15) * 9/5 + 32).toFixed(1);
            const windSpeedMph = (day.wind_speed * 2.23694).toFixed(1);
            const windSpeedKph = (day.wind_speed * 3.6).toFixed(1);
            const cloudCover = `${day.clouds}%`;
            const humidity = `${day.humidity}%`;
            const precipitation = day.rain ? `${day.rain} mm` : day.snow ? `${day.snow} mm` : 'None';
            const pressure = `${day.pressure} hPa`;

            return `
              <div class="daily-forecast-item" data-index="${index}">
                <p><strong class="forecast-date">${date}</strong></p>
                <p>Temp: ${dayTempC}°C / ${dayTempF}°F</p>
                <p>Wind: ${windSpeedMph} mph / ${windSpeedKph} kph</p>
                <p>Clouds: ${cloudCover}</p>
                <p>Humidity: ${humidity}</p>
                <p>Precipitation: ${precipitation}</p>
                <p>Pressure: ${pressure}</p>
                <button class="hourly-forecast-link" data-index="${index}">View Hourly Forecast</button>
              </div>
            `;
          })
          .join('');
        dailyForecastElement.innerHTML = dailyHtml;

        // Debug: Log daily forecast rendering
        console.log('Daily forecast rendered successfully.');

        // Add click event listeners to hourly forecast links
        const hourlyLinks = document.querySelectorAll('.hourly-forecast-link');
        hourlyLinks.forEach((link) => {
          link.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            console.log(`Hourly forecast button clicked for day index: ${index}`);
            showHourlyForecastModal(data, index);
          });
        });

        // Debug: Log event listener setup
        console.log('Event listeners for hourly forecast links added.');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);

      const weatherLocationElement = document.getElementById('weather-location');
      if (weatherLocationElement) {
        weatherLocationElement.innerHTML = `<p>Error loading location data.</p>`;
      }

      const weatherForecastElement = document.getElementById('weather-forecast');
      if (weatherForecastElement) {
        weatherForecastElement.innerHTML = `<p>Error loading weather data.</p>`;
      }
    }
  }

  function showHourlyForecastModal(data, dayIndex) {
    const modal = document.getElementById('hourly-forecast-modal');
    const modalContent = document.getElementById('hourly-forecast-modal-content');

    // Clear previous content and show loading message
    modalContent.innerHTML = `<p>Loading hourly forecast...</p>`;
    console.log(`Preparing hourly forecast modal for day index: ${dayIndex}`);

    // Filter hourly data for the selected day
    const selectedDay = data.daily[dayIndex];
    const startOfDay = new Date(selectedDay.dt * 1000).setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDay.dt * 1000).setHours(23, 59, 59, 999);

    const hourlyData = data.hourly.filter((hour) => {
      const hourTimestamp = hour.dt * 1000;
      return hourTimestamp >= startOfDay && hourTimestamp <= endOfDay;
    });

    // Debug: Log filtered hourly data
    console.log(`Filtered hourly data for day index ${dayIndex}:`, hourlyData);

    if (hourlyData.length === 0) {
      modalContent.innerHTML = `<p>No hourly forecast available for this date (beyond 72 hours).</p>`;
      console.warn('No hourly forecast data available for the selected day.');
    } else {
      const hourlyHtml = hourlyData
        .map((hour) => {
          const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const tempC = (hour.temp - 273.15).toFixed(1);
          const tempF = ((hour.temp - 273.15) * 9/5 + 32).toFixed(1);
          const windSpeedMph = (hour.wind_speed * 2.23694).toFixed(1);
          const windSpeedKph = (hour.wind_speed * 3.6).toFixed(1);
          const cloudCover = `${hour.clouds}%`;
          const humidity = `${hour.humidity}%`;

          return `
            <div class="hourly-forecast-item">
              <p><strong>${time}</strong></p>
              <p>Temp: ${tempC}°C / ${tempF}°F</p>
              <p>Wind: ${windSpeedMph} mph / ${windSpeedKph} kph</p>
              <p>Clouds: ${cloudCover}</p>
              <p>Humidity: ${humidity}</p>
            </div>
          `;
        })
        .join('');
      modalContent.innerHTML = hourlyHtml;

      // Debug: Log modal content update
      console.log('Hourly forecast modal content updated successfully.');
    }

    // Show the modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex'; // Ensure the modal is displayed
    console.log('Hourly forecast modal displayed.');
  }

  // Close the modal when the close button is clicked
  document.getElementById('close-hourly-modal').addEventListener('click', () => {
    const modal = document.getElementById('hourly-forecast-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none'; // Ensure the modal is hidden
    console.log('Hourly forecast modal closed.');
  });

  // Close the modal when clicking outside the modal content
  document.getElementById('hourly-forecast-modal').addEventListener('click', (event) => {
    if (event.target.id === 'hourly-forecast-modal') {
      const modal = document.getElementById('hourly-forecast-modal');
      modal.classList.add('hidden');
      modal.style.display = 'none'; // Ensure the modal is hidden
      console.log('Hourly forecast modal closed by clicking outside.');
    }
  });

  fetchWeatherData(latitude, longitude);
});
