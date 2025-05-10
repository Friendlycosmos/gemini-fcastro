document.addEventListener("DOMContentLoaded", () => {
  const moonDateElement = document.getElementById("moon-date");
  const moonPhaseElement = document.getElementById("moon-phase");
  const moonIlluminationElement = document.getElementById("moon-illumination");
  const moonTypeElement = document.getElementById("moon-type");
  const prevDayButton = document.getElementById("prev-day");
  const nextDayButton = document.getElementById("next-day");

  let currentDate = new Date();

  function updateMoonData(date) {
    try {
      if (typeof Lunar === "undefined") {
        throw new Error("Lunar.js is not loaded.");
      }

      const lunar = new Lunar(date);
      const moonPhase = lunar.phase();
      const illumination = lunar.illumination();
      const moonType = lunar.isWaxing() ? "Waxing" : "Waning";

      moonDateElement.textContent = `Date: ${date.toDateString()}`;
      moonPhaseElement.textContent = `Phase: ${moonPhase}`;
      moonIlluminationElement.textContent = `Illumination: ${illumination}%`;
      moonTypeElement.textContent = `Type: ${moonType}`;
    } catch (error) {
      console.error("Error loading lunar data:", error);
      moonDateElement.textContent = "Error loading data.";
      moonPhaseElement.textContent = "";
      moonIlluminationElement.textContent = "";
      moonTypeElement.textContent = "";
    }
  }

  prevDayButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateMoonData(currentDate);
  });

  nextDayButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateMoonData(currentDate);
  });

  updateMoonData(currentDate);
});
