// db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "locations.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erreur ouverture base SQLite:", err.message);
    } else {
        console.log("Base SQLite connectée:", dbPath);
    }
});

// Création de la table si elle n'existe pas
db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS positions (
                                                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  latitude REAL NOT NULL,
                                                  longitude REAL NOT NULL,
                                                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
         )`,
        (err) => {
            if (err) {
                console.error("Erreur création table:", err.message);
            } else {
                console.log("Table 'positions' prête");
            }
        }
    );
});

module.exports = db;
