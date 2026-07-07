const express = require("express");
const path = require("path");
const { initDB } = require("./db"); // Import bazy

// IMPORT ROUTEROW
const listsRoutes = require("./routes/lists.routes");
const itemsRoutes = require("./routes/item.routes");

const app = express();
app.use(express.json());

// Zmienna globalna, do której przypiszemy gotową bazę
let db;

// Startujemy serwer TYLKO wtedy, gdy baza się poprawnie załaduje
async function startServer() {
  try {
    db = await initDB();

    // Wstrzykujemy bazę do każdego requestu
    // (MUSI być przed routami, żeby widziały req.db)
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Middleware: jeśli nagłówek x-group-id istnieje, upewnij się, że grupa jest w tabeli
    app.use(async (req, res, next) => {
      const groupId = req.headers["x-group-id"];
      if (!groupId) return next();
      try {
        const existing = await req.db.get(`SELECT id FROM groups WHERE id = ?`, [groupId]);
        if (!existing) {
          console.log(`[GROUPS] Tworzenie nowej grupy: ${groupId}`);
          await req.db.run(`INSERT INTO groups (id, name) VALUES (?, ?)`, [groupId, groupId]);
          console.log(`[GROUPS] Grupa ${groupId} została utworzona`);
        }
        return next();
      } catch (err) {
        console.error("Błąd podczas sprawdzania/tworzenia grupy:", err);
        console.error("Szczegóły:", err.message, err.code);
        return res.status(500).json({ message: "Błąd serwera" });
      }
    });

    // PODŁĄCZANIE ROUTÓW
    app.use("/api/shopping-lists", listsRoutes);
    app.use("/api/shopping-lists", itemsRoutes);

    // TESTOWY ROUTE DO SPRAWDZANIA DZIAŁANIA
    app.get("/api/test", (req, res) => {
      res.json({ message: "Działa!" });
    });

    // 2. Serwowanie zbudowanego frontendu
    // Upewnij się, że ścieżka prowadzi do folderu 'dist' w Twoim frontendzie
    const frontendPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(frontendPath));

    // 3. Dla wszystkich innych zapytań wysyłaj index.html (React Router)
    app.get(/(.*)/, (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });

    const PORT = 3000;
    app.listen(PORT, () => console.log(`Serwer działa na http://localhost:${PORT}`));
  } catch (error) {
    console.error("Błąd podczas startu serwera/bazy:", error);
  }
}

// Odpalamy wszystko
startServer();
