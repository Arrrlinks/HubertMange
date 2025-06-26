const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// API pour stocker la position GPS
app.post("/api/location", (req, res) => {
    const { latitude, longitude } = req.body;
    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        isNaN(latitude) ||
        isNaN(longitude)
    ) {
        return res.status(400).send("Invalid latitude or longitude");
    }
    db.run(
        "INSERT INTO positions (latitude, longitude) VALUES (?, ?)",
        [latitude, longitude],
        (err) => {
            if (err) return res.status(500).send("Error saving location");
            res.sendStatus(200);
        }
    );
});

// API pour récupérer la dernière position
app.get("/api/location", (req, res) => {
    db.get(
        "SELECT latitude, longitude FROM positions ORDER BY timestamp DESC LIMIT 1",
        (err, row) => {
            if (err) return res.status(500).send("Error fetching location");
            res.json(row || {});
        }
    );
});

// Variable pour stocker la destination (en mémoire)
let currentDestination = null;

// API pour enregistrer la destination
app.post("/api/destination", (req, res) => {
    const { latitude, longitude } = req.body;
    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        isNaN(latitude) ||
        isNaN(longitude)
    ) {
        return res.status(400).send("Invalid latitude or longitude");
    }
    currentDestination = { latitude, longitude };
    res.sendStatus(200);
});

// API pour récupérer la destination
app.get("/api/destination", (req, res) => {
    if (!currentDestination) {
        return res.json({});
    }
    res.json(currentDestination);
});

app.get("/", (req, res) => {
    // On récupère le user-agent pour la vue
    const userAgent = req.headers["user-agent"] || "";
    res.render("index", { userAgent });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
