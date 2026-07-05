const express = require("express");
const path = require("path");
const app = express();

// IMPORT ROUTEROW
const listsRoutes = require("./routes/lists.routes");
const itemsRoutes = require("./routes/item.routes");

app.use(express.json());

// PODŁĄCZANIE ROUTÓW
// Wszystko z listsRoutes będzie miało przedrostek /api/shopping-lists
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
