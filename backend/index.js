const express = require("express");
const path = require("path");
const { initDB } = require("./db");

// IMPORT ROUTEROW (Nowe ścieżki!)
const listsRoutes = require("./routes/v1/lists.routes");
const itemsRoutes = require("./routes/v1/items.routes");

const app = express();
app.use(express.json());

let db;

async function startServer() {
  try {
    db = await initDB();

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use(async (req, res, next) => {
      const groupId = req.headers["x-group-id"];
      if (!groupId) return next();
      try {
        const existing = await req.db.get(`SELECT id FROM groups WHERE id = ?`, [groupId]);
        if (!existing) {
          console.log(`[GROUPS] Tworzenie nowej grupy: ${groupId}`);
          await req.db.run(`INSERT INTO groups (id, name) VALUES (?, ?)`, [groupId, groupId]);
        }
        return next();
      } catch (err) {
        console.error("Błąd podczas sprawdzania/tworzenia grupy:", err);
        return res.status(500).json({ message: "Błąd serwera" });
      }
    });

    app.use("/api/v1/lists", listsRoutes);
    app.use("/api/v1/items", itemsRoutes);

    app.get("/api/test", (req, res) => {
      res.json({ message: "Działa V1!" });
    });

    const frontendPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(frontendPath));

    app.get(/(.*)/, (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });

    const PORT = 3000;
    app.listen(PORT, () => console.log(`Serwer działa na http://localhost:${PORT}`));
  } catch (error) {
    console.error("Błąd podczas startu serwera/bazy:", error);
  }
}

startServer();
