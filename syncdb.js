const sqlite = require('sqlite3').verbose();

// Létrehozzuk vagy csatlakozunk az adatbázishoz
const db = new sqlite.Database('./database.sqlite', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

// Táblák létrehozása vagy ellenőrzése
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS punishments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        type TEXT NOT NULL,
        reason TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Could not create table', err);
        } else {
            console.log('Table created or already exists');
        }
    });
});

// Az adatbázis lezárása
db.close((err) => {
    if (err) {
        console.error('Error closing the database', err);
    } else {
        console.log('Database connection closed');
    }
});
