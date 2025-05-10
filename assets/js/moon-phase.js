document.addEventListener("DOMContentLoaded", () => {
  const moonDateElement = document.getElementById("moon-date");
  const moonPhaseElement = document.getElementById("moon-phase");
  const moonIlluminationElement = document.getElementById("moon-illumination");
  const moonTypeElement = document.getElementById("moon-type");
  const moonImageElement = document.getElementById("moon-image");
  const prevDayButton = document.getElementById("prev-day");
  const nextDayButton = document.getElementById("next-day");

  let currentDate = new Date();

  function updateMoonData(date) {
    const moonData = SunCalc.getMoonIllumination(date); // Get moon data
    const phase = moonData.phase; // Moon phase (0 = new moon, 0.5 = full moon)
    const illumination = moonData.fraction * 100; // Illumination percentage
    const moonType = phase < 0.5 ? "Waxing" : "Waning"; // Determine waxing or waning

    // Update the DOM with moon phase data
    moonDateElement.textContent = `Date: ${date.toDateString()}`;
    moonPhaseElement.textContent = `Phase: ${getPhaseName(phase)}`;
    moonIlluminationElement.textContent = `Illumination: ${illumination.toFixed(1)}%`;
    moonTypeElement.textContent = `Type: ${moonType}`;
    moonImageElement.src = getMoonImage(phase); // Update moon image
  }

  function getPhaseName(phase) {
    if (phase >= 0 && phase < 0.03) return "New Moon";
    if (phase > 0 && phase < 0.25) return "Waxing Crescent";
    if (phase >= 0.25 && phase < 0.28) return "First Quarter";
    if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
    if (phase >= 0.5 && phase < 0.53) return "Full Moon";
    if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
    if (phase >= 0.75 && phase < 0.78) return "Last Quarter";
    return "Waning Crescent";
  }

  function getMoonImage(phase) {
    const basePath = "assets/images/moon_phases/";
    let phaseName = "waning-crescent"; // Default

    if (phase >= 0 && phase < 0.03) phaseName = "new-moon";
    else if (phase > 0 && phase < 0.25) phaseName = "waxing-crescent";
    else if (phase >= 0.25 && phase < 0.28) phaseName = "first-quarter";
    else if (phase > 0.25 && phase < 0.5) phaseName = "waxing-gibbous";
    else if (phase >= 0.5 && phase < 0.53) phaseName = "full";
    else if (phase > 0.5 && phase < 0.75) phaseName = "waning-gibbous";
    else if (phase >= 0.75 && phase < 0.78) phaseName = "third-quarter";

    // Check for .webp first, fallback to .jpg
    const webpPath = `${basePath}${phaseName}.webp`;
    const jpgPath = `${basePath}${phaseName}.jpg`;

    console.log("Trying .webp:", webpPath); // Debugging log
    console.log("Fallback .jpg:", jpgPath); // Debugging log

    const img = new Image();
    img.src = webpPath;
    img.onload = () => (moonImageElement.src = webpPath);
    img.onerror = () => (moonImageElement.src = jpgPath);
    return webpPath; // Default to .webp initially
  }

  prevDayButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    console.log("Previous Day:", currentDate); // Debugging log
    updateMoonData(currentDate);
  });

  nextDayButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    console.log("Next Day:", currentDate); // Debugging log
    updateMoonData(currentDate);
  });

  // Initialize with the current date
  updateMoonData(currentDate);
});
