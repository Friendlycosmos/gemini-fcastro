document.addEventListener("DOMContentLoaded", () => {
  const weatherDataElement = document.getElementById("weather-data");
  const weatherForecastElement = document.getElementById("weather-forecast");
  const hourlyForecastModal = document.getElementById("hourly-forecast-modal");
  const hourlyForecastContent = document.getElementById("hourly-forecast-content");
  const closeHourlyForecast = document.getElementById("close-hourly-forecast");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const updateLocationButton = document.getElementById("update-location");
  const detectLocationButton = document.getElementById("detect-location");

  let latitude = 40.7128; // Default: New York latitude
  let longitude = -74.0060; // Default: New York longitude

  async function fetchWeather() {
    const apiKey = "974c65cb35134b07b72ad5a02d89044e"; // Provided Weatherbit API key
    const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}&days=3`;
    const hourlyUrl = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${latitude}&lon=${longitude}&key=${apiKey}&hours=24`;

    try {
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text(); // Log the full error response
        throw new Error(`Forecast API Error: ${errorText}`);
      }
      const forecastData = await forecastResponse.json();
      console.log("Forecast Data:", forecastData); // Log the forecast data for debugging

      // Display current weather
      const current = forecastData.data[0];
      weatherDataElement.innerHTML = `
        <p><strong>Location:</strong> ${forecastData.city_name}, ${forecastData.state_code}</p>
        <p><strong>Temperature:</strong> ${current.temp}°C</p>
        <p><strong>Condition:</strong> ${current.weather.description}</p>
        <p><strong>Wind Speed:</strong> ${current.wind_spd.toFixed(1)} m/s</p>
      `;

      // Display 3-day forecast
      const forecastHtml = forecastData.data
        .map((day, index) => {
          return `
            <div class="forecast-day" data-index="${index}" style="cursor: pointer;">
              <p><strong>${day.valid_date}</strong></p>
              <p><img src="https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png" alt="${day.weather.description}" /></p>
              <p><strong>Max:</strong> ${day.max_temp}°C</p>
              <p><strong>Min:</strong> ${day.min_temp}°C</p>
              <p><strong>Condition:</strong> ${day.weather.description}</p>
            </div>
          `;
        })
        .join("");
      weatherForecastElement.innerHTML = forecastHtml;

      // Add click event listeners to forecast days
      const forecastDays = document.querySelectorAll(".forecast-day");
      forecastDays.forEach((dayElement) => {
        dayElement.addEventListener("click", async () => {
          const index = dayElement.getAttribute("data-index");
          const selectedDay = forecastData.data[index];
          await displayHourlyForecast(hourlyUrl, selectedDay.valid_date, forecastData.data);
        });
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      weatherDataElement.innerHTML = `<p class="error">Unable to fetch weather data. Please try again.</p>`;
      weatherForecastElement.innerHTML = `<p class="error">Unable to fetch forecast data. Please try again.</p>`;
    }
  }

  async function displayHourlyForecast(hourlyUrl, selectedDate, dailyData) {
    try {
      const hourlyResponse = await fetch(hourlyUrl);
      if (!hourlyResponse.ok) {
        throw new Error(`Hourly API Error: ${hourlyResponse.statusText}`);
      }
      const hourlyData = await hourlyResponse.json();

      console.log("Hourly Data:", hourlyData); // Debugging log
      console.log("Selected Date:", selectedDate); // Debugging log

      // Filter hourly data for the selected date
      const filteredHours = hourlyData.data.filter((hour) => {
        const hourDate = hour.timestamp_local.split("T")[0]; // Extract the date part
        return hourDate === selectedDate; // Compare with selected date
      });

      console.log("Filtered Hours for Selected Date:", filteredHours); // Debugging log

      if (filteredHours.length === 0) {
        // Fall back to daily data
        const selectedDay = dailyData.find((day) => day.valid_date === selectedDate);
        if (selectedDay) {eatherbit API provides hourly data only for the next 48 hours.</p>`;
          hourlyForecastContent.innerHTML = ` hourlyForecastModal.style.display = "block"; // Ensure the modal still opens
            <p><strong>Date:</strong> ${selectedDay.valid_date}</p>        return;
            <p><strong>Max Temperature:</strong> ${selectedDay.max_temp}°C</p>
            <p><strong>Min Temperature:</strong> ${selectedDay.min_temp}°C</p>
            <p><strong>Condition:</strong> ${selectedDay.weather.description}</p>or hourly data
            <p><img src="https://www.weatherbit.io/static/img/icons/${selectedDay.weather.icon}.png" alt="${selectedDay.weather.description}" /></p>Html = filteredHours
          `;
        } else {
          hourlyForecastContent.innerHTML = `
            <p class="error">No data available for the selected day.</p>`;}</p>
        }
        hourlyForecastModal.style.display = "block"; // Ensure the modal still opens
        return;/img/icons/${hour.weather.icon}.png" alt="${hour.weather.description}" /></p>
      }strong>Wind Speed:</strong> ${hour.wind_spd.toFixed(1)} m/s</p>
  <p><strong>Humidity:</strong> ${hour.rh}%</p>
      // Generate HTML for hourly data  </div>
      const hourlyHtml = filteredHours
        .map((hour) => {        })
          return `
            <div class="hourly-entry">
              <p><strong>Time:</strong> ${hour.timestamp_local.split("T")[1]}</p>ontent.innerHTML = hourlyHtml;
              <p><strong>Temperature:</strong> ${hour.temp}°C</p>
              <p><strong>Condition:</strong> ${hour.weather.description}</p>
              <p><img src="https://www.weatherbit.io/static/img/icons/${hour.weather.icon}.png" alt="${hour.weather.description}" /></p>
              <p><strong>Wind Speed:</strong> ${hour.wind_spd.toFixed(1)} m/s</p> hourlyForecastContent.innerHTML = `<p class="error">Unable to fetch hourly data. Please try again.</p>`;
              <p><strong>Humidity:</strong> ${hour.rh}%</p>   hourlyForecastModal.style.display = "block"; // Ensure the modal still opens
            </div>    }
          `;
        })
        .join("");seHourlyForecast.addEventListener("click", () => {
    hourlyForecastModal.style.display = "none";
      hourlyForecastContent.innerHTML = hourlyHtml;
      hourlyForecastModal.style.display = "block";
    } catch (error) {, () => {
      console.error("Error fetching hourly data:", error);cation) {
      hourlyForecastContent.innerHTML = `<p class="error">Unable to fetch hourly data. Please try again.</p>`;(
      hourlyForecastModal.style.display = "block"; // Ensure the modal still opens
    }
  }

  closeHourlyForecast.addEventListener("click", () => {
    hourlyForecastModal.style.display = "none";console.log(`Detected location: Latitude: ${latitude}, Longitude: ${longitude}`);
  });er(); // Fetch weather after detecting location

  detectLocationButton.addEventListener("click", () => {
    if (navigator.geolocation) { console.error("Error detecting location:", error);
      navigator.geolocation.getCurrentPosition(  alert("Unable to detect your location. Please enter it manually.");
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude; else {
          latitudeInput.value = latitude.toFixed(4); alert("Geolocation is not supported by your browser.");
          longitudeInput.value = longitude.toFixed(4);    }
          console.log(`Detected location: Latitude: ${latitude}, Longitude: ${longitude}`);
          fetchWeather(); // Fetch weather after detecting location
        },() => {
        (error) => {    const lat = parseFloat(latitudeInput.value);
          console.error("Error detecting location:", error);nput.value);
          alert("Unable to detect your location. Please enter it manually.");
        } !isNaN(lon)) {
      );
    } else {
      alert("Geolocation is not supported by your browser.");e.log(`Location updated to Latitude: ${latitude}, Longitude: ${longitude}`);
    }te
  }); else {
 alert("Please enter valid latitude and longitude values.");
  updateLocationButton.addEventListener("click", () => {    }
    const lat = parseFloat(latitudeInput.value);
    const lon = parseFloat(longitudeInput.value);
/ Fetch weather for the default location on page load
    if (!isNaN(lat) && !isNaN(lon)) {  fetchWeather();













});  fetchWeather();  // Fetch weather for the default location on page load  });    }      alert("Please enter valid latitude and longitude values.");    } else {      fetchWeather(); // Fetch weather after manual location update      console.log(`Location updated to Latitude: ${latitude}, Longitude: ${longitude}`);      longitude = lon;      latitude = lat;});
