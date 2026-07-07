const express = require("express");
const router = express.Router();

const { randomUUID } = require("crypto");

// DODAWANIE PRODUKTU (POST)
router.post("/:listId/items", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });
  const listId = req.params.listId;
  const { name, quantity = 1, unit = "szt." } = req.body;

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    const id = randomUUID();
    await req.db.run(
      `INSERT INTO items (id, list_id, name, quantity, unit) VALUES (?, ?, ?, ?, ?)`,
      [id, listId, name, quantity, unit],
    );
    const newItem = { id, name, quantity, unit, completed: false };

    const itemsInRow = await req.db.get(
      `SELECT COUNT(*) as cnt FROM items WHERE list_id = ? AND deleted_at IS NULL`,
      [listId],
    );
    const completedRow = await req.db.get(
      `SELECT COUNT(*) as cnt FROM items WHERE list_id = ? AND completed_at IS NOT NULL AND deleted_at IS NULL`,
      [listId],
    );

    const listSummary = { id: listId, itemsIn: itemsInRow.cnt, completedCount: completedRow.cnt };

    res.status(201).json({ message: "Dodano produkt", item: newItem, list: listSummary });
  } catch (error) {
    res.status(500).json({ message: "Błąd dodawania produktu", error: error.message });
  }
});

// ZMIANA STATUSU (PUT)
router.put("/:listId/items/:itemId", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = req.params.listId;
  const itemId = req.params.itemId;
  const { completed } = req.body;

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    const item = await req.db.get(
      `SELECT id, name, quantity, unit, completed_at FROM items WHERE id = ? AND list_id = ? AND deleted_at IS NULL`,
      [itemId, listId],
    );
    if (!item) return res.status(404).json({ message: "Nie znaleziono produktu" });

    if (completed) {
      await req.db.run(`UPDATE items SET completed_at = CURRENT_TIMESTAMP WHERE id = ?`, [itemId]);
    } else {
      await req.db.run(`UPDATE items SET completed_at = NULL WHERE id = ?`, [itemId]);
    }

    const updatedItemRow = await req.db.get(
      `SELECT id, name, quantity, unit, completed_at FROM items WHERE id = ?`,
      [itemId],
    );
    const updatedItem = {
      id: updatedItemRow.id,
      name: updatedItemRow.name,
      quantity: updatedItemRow.quantity,
      unit: updatedItemRow.unit,
      completed: !!updatedItemRow.completed_at,
    };

    const itemsInRow = await req.db.get(
      `SELECT COUNT(*) as cnt FROM items WHERE list_id = ? AND deleted_at IS NULL`,
      [listId],
    );
    const completedRow = await req.db.get(
      `SELECT COUNT(*) as cnt FROM items WHERE list_id = ? AND completed_at IS NOT NULL AND deleted_at IS NULL`,
      [listId],
    );
    const listSummary = { id: listId, itemsIn: itemsInRow.cnt, completedCount: completedRow.cnt };

    res.json({ message: "Status zaktualizowany", item: updatedItem, list: listSummary });
  } catch (error) {
    res.status(500).json({ message: "Błąd aktualizacji statusu", error: error.message });
  }
});

// USUWANIE (DELETE)
router.delete("/:listId/items/:itemId", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = req.params.listId;
  const itemId = req.params.itemId;

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    const item = await req.db.get(
      `SELECT id FROM items WHERE id = ? AND list_id = ? AND deleted_at IS NULL`,
      [itemId, listId],
    );
    if (!item) return res.status(404).json({ message: "Nie znaleziono produktu" });

    await req.db.run(`UPDATE items SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [itemId]);

    const itemsInRow = await req.db.get(
      `SELECT COUNT(*) as cnt FROM items WHERE list_id = ? AND deleted_at IS NULL`,
      [listId],
    );
    const listSummary = { id: listId, itemsIn: itemsInRow.cnt };

    res.json({ message: "Produkt został usunięty", list: listSummary });
  } catch (error) {
    res.status(500).json({ message: "Błąd usuwania produktu", error: error.message });
  }
});

module.exports = router;
