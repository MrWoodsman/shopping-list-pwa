const express = require("express");
const path = require("path");
const app = express();

// TESTOWE DANE
const shoppingLists = [
  {
    id: 162765436543,
    name: "Pierwsza lista",
    createdAt: "02.07.2026",
    itemsIn: 4,
    completedCount: 1,
  },
  {
    id: 162765436544,
    name: "Obiad niedziela",
    createdAt: "02.07.2026",
    itemsIn: 6,
    completedCount: 2,
  },
  {
    id: 162765436545,
    name: "Zupa Meksykańska",
    createdAt: "02.07.2026",
    itemsIn: 10,
    completedCount: 0,
  },
  {
    id: 162765436561,
    name: "Impreza Urodzinowa",
    createdAt: "04.07.2026",
    itemsIn: 32,
    completedCount: 4,
  },
];

// 1. Twoje API (musi być przed statycznymi plikami!)
app.get("/api/test", (req, res) => {
  res.json({ message: "Działa!" });
});

// POBRANIE WSZYSTKICH LIST
app.get("/api/shopping-lists", (req, res) => {
  res.json(shoppingLists);
});

// POBRANIE WYBRANEJ LISTY
app.get("/api/shopping-lists/:id", (req, res) => {
  const listId = parseInt(req.params.id);
  const list = shoppingLists.find((l) => l.id === listId);

  if (list) {
    res.json(list);
  } else {
    res.status(404).json({ message: "Nie znaleziono listy" });
  }
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
