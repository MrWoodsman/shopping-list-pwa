const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

async function initDB() {
  // Otwieramy połączenie z plikiem (utworzy się automatycznie)
  const db = await open({
    filename: path.join(__dirname, "database.sqlite"),
    driver: sqlite3.Database,
  });

  // Włączamy FOREIGN KEY constraints
  await db.exec("PRAGMA foreign_keys = ON;");

  // Tworzymy tabelę Grup
  await db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT,
      created_at DATETIME DEFAULT (datetime('now','localtime'))
    )
  `);

  // Tworzymy tabelę List
  await db.exec(`
    CREATE TABLE IF NOT EXISTS lists (
      id TEXT PRIMARY KEY,
      group_id TEXT,
      name TEXT,
      created_at DATETIME DEFAULT (datetime('now','localtime')),
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    )
  `);

  // Tworzymy tabelę Produktów
  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      list_id TEXT,
      name TEXT,
      quantity REAL,
      unit TEXT,
      created_at DATETIME DEFAULT (datetime('now','localtime')),
      completed_at DATETIME DEFAULT NULL,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (list_id) REFERENCES lists(id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      group_id TEXT,
      name TEXT,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT (datetime('now','localtime')),
      last_update DATETIME DEFAULT (datetime('now','localtime')),
      deleted_at DATETIME DEFAULT NULL,
      time_to_make INTEGER,
      is_global BOOLEAN DEFAULT 0,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    )
    `);

  console.log("Baza danych SQLite została załadowana i tabele są gotowe!");
  return db;
}

// Eksportujemy funkcję, żeby wywołać ją w index.js
module.exports = { initDB };
