const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = 3001; // Changed port to 3001

// AstronomyAPI credentials
const applicationId = "590e4a1b-09ca-4a20-bf6b-51946a8ab0d2"; // Provided Application ID
const applicationSecret = "503a38742ecc27c89b0cce5ad5986877b3aff9d9c7cd8a4a4c3"; // Provided Application Secret
const authString = Buffer.from(`${applicationId}:${applicationSecret}`).toString("base64");

app.get("/api/moon-phase", async (req, res) => {
  const { date } = req.query;
  const apiUrl = `https://api.astronomyapi.com/api/v2/studio/moon-phase?date=${date}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching moon phase data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
