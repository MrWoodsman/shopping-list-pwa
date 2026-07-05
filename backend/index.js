const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// TESTOWE DANE
const shoppingLists = [
  {
    id: 162765436543,
    name: "Pierwsza lista",
    createdAt: "02.07.2026",
    itemsIn: 9,
    completedCount: 1,
    items: [
      { id: 1, name: "Mleko", completed: false },
      { id: 2, name: "Chleb", completed: true },
      { id: 3, name: "Kawa", completed: false },
      { id: 4, name: "Jajka", completed: false },
      { id: 5, name: "Ciasto", completed: false },
      { id: 6, name: "Jabłka", completed: false },
      { id: 7, name: "Cytryny", completed: false },
      { id: 8, name: "Ser", completed: false },
      { id: 9, name: "Masło", completed: false },
    ],
  },
  {
    id: 162765436544,
    name: "Obiad niedziela",
    createdAt: "02.07.2026",
    itemsIn: 6,
    completedCount: 0,
    items: [
      { id: 1, name: "Mleko", completed: false },
      { id: 2, name: "Kawa", completed: false },
      { id: 3, name: "Jajka", completed: false },
      { id: 4, name: "Jabłka", completed: false },
      { id: 5, name: "Cytryny", completed: false },
      { id: 6, name: "Masło", completed: false },
    ],
  },
  {
    id: 162765436545,
    name: "Zupa Meksykańska",
    createdAt: "02.07.2026",
    itemsIn: 5,
    completedCount: 0,
    items: [
      { id: 1, name: "Mleko", completed: false },
      { id: 2, name: "Chleb", completed: true },
      { id: 3, name: "Kawa", completed: false },
      { id: 4, name: "Jajka", completed: false },
      { id: 5, name: "Ciasto", completed: false },
    ],
  },
  {
    id: 162765436561,
    name: "Impreza Urodzinowa",
    createdAt: "04.07.2026",
    itemsIn: 4,
    completedCount: 0,
    items: [
      { id: 1, name: "Jabłka", completed: false },
      { id: 2, name: "Cytryny", completed: false },
      { id: 3, name: "Ser", completed: false },
      { id: 4, name: "Masło", completed: false },
    ],
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

// ZMIANA STATUSU PRODUKTU NA LISCIE
app.put(
  "/api/shopping-lists/:listId/items/:itemId",
  (express.json(),
  (req, res) => {
    const listId = parseInt(req.params.listId);
    const itemId = parseInt(req.params.itemId);
    const { completed } = req.body; // Frontend wyśle np. { completed: true }

    const list = shoppingLists.find((l) => l.id === listId);
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    const item = list.items.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ message: "Nie znaleziono produktu" });

    // Zmiana statusu
    item.completed = completed;

    // Opcjonalnie: przelicz completedCount w locie
    list.completedCount = list.items.filter((i) => i.completed).length;

    res.json({ message: "Status zaktualizowany", item, list });
  }),
);

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
