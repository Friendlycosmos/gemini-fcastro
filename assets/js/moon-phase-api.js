document.addEventListener("DOMContentLoaded", () => {
  const moonDateElement = document.getElementById("moon-date");
  const moonPhaseElement = document.getElementById("moon-phase");
  const moonIlluminationElement = document.getElementById("moon-illumination");
  const moonTypeElement = document.getElementById("moon-type");
  const moonImageElement = document.getElementById("moon-image");

  let currentDate = new Date();

  async function fetchMoonPhase(date) {
    const apiUrl = `http://localhost:3001/api/moon-phase?date=${date}`; // Updated port

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Moon Phase Data:", data); // Debugging log

      // Extract moon phase and illumination
      const phase = data.data.phase.name;
      const illumination = data.data.illumination;

      // Update the UI
      moonDateElement.textContent = `Date: ${date}`;
      moonPhaseElement.textContent = `Phase: ${phase}`;
      moonIlluminationElement.textContent = `Illumination: ${illumination}%`;
      moonTypeElement.textContent = `Type: ${phase}`;

      // Update the moon image
      const phaseImageName = phase.toLowerCase().replace(" ", "-");
      moonImageElement.src = `assets/images/moon_phases/${phaseImageName}.png`;
      moonImageElement.alt = phase;

      // Handle missing images gracefully
      moonImageElement.onerror = () => {
        moonImageElement.src = `assets/images/moon_phases/default.png`;
      };
    } catch (error) {
      console.error("Error fetching moon phase data:", error);
      moonDateElement.textContent = "Error loading moon phase data.";
      moonPhaseElement.textContent = "";
      moonIlluminationElement.textContent = "";
      moonTypeElement.textContent = "";
    }
  }

  document.getElementById("prev-day").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    fetchMoonPhase(currentDate.toISOString().split("T")[0]);
  });

  document.getElementById("next-day").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    fetchMoonPhase(currentDate.toISOString().split("T")[0]);
  });

  // Initialize with the current date
  fetchMoonPhase(currentDate.toISOString().split("T")[0]);
});
