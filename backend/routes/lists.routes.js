// backend/routes/lists.routes.js
const express = require("express");
const router = express.Router();
const { shoppingLists } = require("../data/store");

// POBRANIE WSZYSTKICH LIST (GET /api/shopping-lists)
router.get("/", (req, res) => {
  res.json(shoppingLists);
});

// POBRANIE JEDNEJ LISTY (GET /api/shopping-lists/:id)
router.get("/:id", (req, res) => {
  const listId = parseInt(req.params.id);
  const list = shoppingLists.find((l) => l.id === listId);

  if (list) {
    res.json(list);
  } else {
    res.status(404).json({ message: "Nie znaleziono listy" });
  }
});

module.exports = router;
