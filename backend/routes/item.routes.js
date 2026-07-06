const express = require("express");
const router = express.Router();
const { shoppingLists } = require("../data/store");

// DODAWANIE PRODUKTU (POST)
router.post("/:listId/items", (req, res) => {
  const groupId = req.headers["x-group-id"];
  const listId = parseInt(req.params.listId);
  // Odbieramy nowe pola z frontendu (z domyślnymi wartościami)
  const { name, quantity = 1, unit = "szt." } = req.body;

  const list = shoppingLists.find((l) => l.id === listId && l.groupId === groupId);
  if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

  const newItem = {
    id: Date.now(),
    name: name,
    quantity: quantity,
    unit: unit,
    completed: false,
  };

  list.items.push(newItem);
  list.itemsIn += 1;

  res.status(201).json({ message: "Dodano produkt", item: newItem });
});

// ZMIANA STATUSU (PUT)
router.put("/:listId/items/:itemId", (req, res) => {
  const groupId = req.headers["x-group-id"];
  const listId = parseInt(req.params.listId);
  const itemId = parseInt(req.params.itemId);
  const { completed } = req.body;

  const list = shoppingLists.find((l) => l.id === listId && l.groupId === groupId);
  if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

  const item = list.items.find((i) => i.id === itemId);
  if (!item) return res.status(404).json({ message: "Nie znaleziono produktu" });

  item.completed = completed;
  list.completedCount = list.items.filter((i) => i.completed).length;

  res.json({ message: "Status zaktualizowany", item, list });
});

// USUWANIE (DELETE)
router.delete("/:listId/items/:itemId", (req, res) => {
  const groupId = req.headers["x-group-id"];
  const listId = parseInt(req.params.listId);
  const itemId = parseInt(req.params.itemId);

  const list = shoppingLists.find((l) => l.id === listId && l.groupId === groupId);
  if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

  const itemIndex = list.items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) return res.status(404).json({ message: "Nie znaleziono produktu" });

  list.items.splice(itemIndex, 1);

  if (list.itemsIn) {
    list.itemsIn -= 1;
  }

  res.json({ message: "Produkt został usunięty" });
});

module.exports = router;
