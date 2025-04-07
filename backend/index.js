const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

// Predefined Data API
app.get("/location-info", (req, res) => {
  let locationData = [
    {
    surveyNumber: "49",
    villageName: "Benniganahalli",
    hobliName: "Mahadevapura",
    ownerName: "SK Bhat",
    extent: "1-27-2",
    address: "3rd A Main Road, Doorvani Nagar, Bangalore - 560015",
  },
  {
    surveyNumber: "48",
    villageName: "Munnekolalu",
    hobliName: "Varturu-1",
    ownerName: "Rama Raju",
    talukName:"Bangalore-east",
    extent: "1-27-2",
    address: "Saibaba temple raod, 9th cross road",
  },
  {
    surveyNumber: "4",
    villageName: "Munnekolalu",
    hobliName: "Varturu-1",
    ownerName: "K VINAY",
    talukName:"Bangalore-east",
    extent: "1-27-2",
    address: "Silver Spring Layout, 9th cross road",
  }]
  res.json(locationData);
});

// GeoJSON Data API
app.get("/geojson-data", async (req, res) => {
  try {
    const geoJsonUrls = [
      "https://soumya780.github.io/kmz_file/map.geojson",
      "https://soumya780.github.io/kmz_file/AswathNagar.geojson",
      "https://soumya780.github.io/kmz_file/19085.geojson",
    ];

    const geoJsonData = await Promise.all(
      geoJsonUrls.map(async (url) => {
        const response = await axios.get(url);  
        return response.data;
      })
    );

    // Extracting relevant details from GeoJSON
    const extractedData = geoJsonData.map((geoJson, index) => ({
      name: `GeoJSON File ${index + 1}`,
      totalFeatures: geoJson.features.length,
      areas: geoJson.features.map((feature) => ({
        type: feature.geometry.type,
        area: feature.properties?.area || "N/A", // Assuming 'area' exists in properties
        coordinates: feature.geometry.coordinates,
      })),
    }));

    res.json(extractedData);
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    res.status(500).json({ error: "Failed to fetch GeoJSON data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
