const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();// create express app
app.use(cors());//allow cors - so chrome ext can communicat with local API
app.use(express.json());//enable JSON parsing for post requests

const FAV_FILE = path.join(__dirname, "favourites.json");
// Ensure file exists
if (!fs.existsSync(FAV_FILE)) {
    fs.writeFileSync(FAV_FILE, JSON.stringify([]));
}

// GET /api/favourites
app.get("/api/favourites", (req, res) => {
    const favourites = JSON.parse(fs.readFileSync(FAV_FILE, "utf-8"));
    res.json(favourites); //return all favourite stations
});

// POST /api/favourites
app.post("/api/favourites", (req, res) => {
    const { station } = req.body;
    if (!station) return res.status(400).json({ error: "Missing station name" });// validation that station is a stasion

    const favourites = JSON.parse(fs.readFileSync(FAV_FILE, "utf-8"));//load favourites
    
    // Check for duplicates (ignore case)
    if (favourites.some(fav => fav.station.toLowerCase() === station.toLowerCase())) {
        return res.status(400).json({ success: false, error: "Station already saved" });
    }

    // Add timestamp automatically
    const savedAt = new Date().toISOString();

    favourites.push({ station, savedAt });
    fs.writeFileSync(FAV_FILE, JSON.stringify(favourites, null, 2));

    console.log(` Favourite saved: ${station}`);
    res.json({ success: true, station });
});


// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Favourites API running at http://localhost:${PORT}`));
