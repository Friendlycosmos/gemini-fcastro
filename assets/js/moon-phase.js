document.addEventListener("DOMContentLoaded", () => {
  const moonDateElement = document.getElementById("moon-date");
  const moonPhaseElement = document.getElementById("moon-phase");
  const moonIlluminationElement = document.getElementById("moon-illumination");
  const moonTypeElement = document.getElementById("moon-type");
  const moonImageElement = document.getElementById("moon-image");

  let currentDate = new Date();

  function updateMoonPhase(date) {
    const moonData = SunCalc.getMoonIllumination(date);
    console.log("Moon Data:", moonData); // Debugging log

    const phase = moonData.phase; // Moon phase as a fraction
    const illumination = (moonData.fraction * 100).toFixed(1); // Illumination percentage

    // Map phase to moon phase names
    let phaseName = "";
    if (phase === 0) {
      phaseName = "New Moon";
    } else if (phase > 0 && phase < 0.25) {
      phaseName = "Waxing Crescent";
    } else if (phase === 0.25) {
      phaseName = "First Quarter";
    } else if (phase > 0.25 && phase < 0.5) {
      phaseName = "Waxing Gibbous";
    } else if (phase === 0.5) {
      phaseName = "Full Moon";
    } else if (phase > 0.5 && phase < 0.75) {
      phaseName = "Waning Gibbous";
    } else if (phase === 0.75) {
      phaseName = "Last Quarter";
    } else if (phase > 0.75 && phase < 1) {
      phaseName = "Waning Crescent";
    }

    // Update the UI
    moonDateElement.textContent = `Date: ${date.toDateString()}`;
    moonPhaseElement.textContent = `Phase: ${phaseName}`;
    moonIlluminationElement.textContent = `Illumination: ${illumination}%`;
    moonTypeElement.textContent = `Type: ${phaseName}`;

    // Update the moon image
    const phaseImageName = phaseName.toLowerCase().replace(" ", "-");
    moonImageElement.src = `assets/images/moon_phases/${phaseImageName}.png`;
    moonImageElement.alt = phaseName;
  }

  document.getElementById("prev-day").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateMoonPhase(currentDate);
  });

  document.getElementById("next-day").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateMoonPhase(currentDate);
  });

  // Initialize with the current date
  updateMoonPhase(currentDate);
});
