// backend/routes/items.routes.js
const express = require("express");
const router = express.Router();
const { shoppingLists } = require("../data/store"); // Importujemy naszą "bazę"

// DODAWANIE PRODUKTU (POST) - zauważ ścieżkę! Zaczynamy od /:listId/items
router.post("/:listId/items", (req, res) => {
  const listId = parseInt(req.params.listId);
  const { name } = req.body;

  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

  const newItem = {
    id: Date.now(),
    name: name,
    completed: false,
  };

  list.items.push(newItem);

  list.itemsIn += 1;

  res.status(201).json({ message: "Dodano produkt", item: newItem });
});

// ZMIANA STATUSU (PUT)
router.put("/:listId/items/:itemId", (req, res) => {
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
});

// USUWANIE (DELETE)
router.delete("/:listId/items/:itemId", (req, res) => {
  const listId = parseInt(req.params.listId);
  const itemId = parseInt(req.params.itemId);

  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

  // Szukamy indeksu (pozycji w tablicy) produktu
  const itemIndex = list.items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) return res.status(404).json({ message: "Nie znaleziono produktu" });

  // Usuwamy 1 element z tablicy zaczynając od znalezionego indeksu
  list.items.splice(itemIndex, 1);

  // Opcjonalnie: aktualizujemy ogólną liczbę produktów, jeśli ją śledzisz
  if (list.itemsIn) {
    list.itemsIn -= 1;
  }

  res.json({ message: "Produkt został usunięty" });
});

module.exports = router;
