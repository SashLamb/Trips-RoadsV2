// main/database.js
const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

const dbFolder = path.join(__dirname, '..');

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

const dbPath = path.join(dbFolder, 'database.db');
console.log('Base de données stockée ici :', dbPath);

const db = new Database(dbPath, { verbose: console.log });

function initDatabase() {
    db.pragma('foreign_keys = ON');

    db.prepare(`
    CREATE TABLE IF NOT EXISTS road_trips (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      main_currency TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();

    db.prepare(`
    CREATE TABLE IF NOT EXISTS steps (
      id TEXT PRIMARY KEY,
      road_trip_id TEXT NOT NULL,
      title TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      description TEXT,
      latitude REAL,
      longitude REAL,
      FOREIGN KEY (road_trip_id) REFERENCES road_trips(id) ON DELETE CASCADE
    )
  `).run();

    db.prepare(`
    CREATE TABLE IF NOT EXISTS transports (
      id TEXT PRIMARY KEY,
      step_id TEXT NOT NULL,
      type TEXT NOT NULL,
      route_geometry TEXT,
      FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE
    )
  `).run();

    db.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      road_trip_id TEXT NOT NULL,
      step_id TEXT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      FOREIGN KEY (road_trip_id) REFERENCES road_trips(id) ON DELETE CASCADE,
      FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE
    )
  `).run();

    db.prepare(`
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      step_id TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE
    )
  `).run();
}

module.exports = {
    db,
    initDatabase
};