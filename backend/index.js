const express = require("express");
const path = require("path");
const app = express();

// 1. Twoje API (musi być przed statycznymi plikami!)
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
