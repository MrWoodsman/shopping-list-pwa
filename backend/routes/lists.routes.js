const express = require("express");
const router = express.Router();

// POBRANIE WSZYSTKICH LIST DLA DANEJ GRUPY
router.get("/", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy w zapytaniu" });

  try {
    const lists = await req.db.all(
      `SELECT id, group_id as groupId, name, created_at as createdAt
       FROM lists
       WHERE group_id = ? AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [groupId],
    );

    for (const l of lists) {
      const items = await req.db.all(
        `SELECT id, name, quantity, unit, completed_at FROM items WHERE list_id = ? AND deleted_at IS NULL`,
        [l.id],
      );
      l.items = items.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
        completed: !!i.completed_at,
      }));
      l.itemsIn = items.length;
      l.completedCount = items.filter((i) => i.completed_at).length;
    }

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

const { randomUUID } = require("crypto");

// POBRANIE JEDNEJ LISTY
router.get("/:id", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = req.params.id;
  try {
    const list = await req.db.get(
      `SELECT id, group_id as groupId, name, created_at as createdAt FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );

    if (!list) return res.status(404).json({ message: "Nie znaleziono listy lub brak dostępu" });

    const items = await req.db.all(
      `SELECT id, name, quantity, unit, completed_at FROM items WHERE list_id = ? AND deleted_at IS NULL`,
      [listId],
    );

    list.items = items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
      completed: !!i.completed_at,
    }));
    list.itemsIn = items.length;
    list.completedCount = items.filter((i) => i.completed_at).length;

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// TWORZENIE NOWEJ LISTY
router.post("/", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const { name } = req.body;
  try {
    const id = randomUUID();
    console.log(`[LISTS:POST] Tworzenie listy: id=${id}, groupId=${groupId}, name=${name || "Nowa lista"}`);
    await req.db.run(`INSERT INTO lists (id, group_id, name) VALUES (?, ?, ?)`, [id, groupId, name || "Nowa lista"]);
    console.log(`[LISTS:POST] Lista ${id} została utworzona`);
    const newList = { id, groupId, name: name || "Nowa lista", itemsIn: 0, completedCount: 0, items: [] };

    res.status(201).json({ message: "Utworzono listę", list: newList });
  } catch (error) {
    console.error(`[LISTS:POST] Błąd:`, error.message);
    res.status(500).json({ message: "Błąd tworzenia listy", error: error.message });
  }
});

// EDYCJA LISTY (PUT) - Zmiana nazwy
router.put("/:id", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = req.params.id;
  const { name } = req.body;

  try {
    const existing = await req.db.get(`SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`, [listId, groupId]);
    if (!existing) return res.status(404).json({ message: "Nie znaleziono listy" });

    if (name) await req.db.run(`UPDATE lists SET name = ? WHERE id = ?`, [name, listId]);

    const updated = await req.db.get(`SELECT id, group_id as groupId, name, created_at as createdAt FROM lists WHERE id = ?`, [listId]);
    res.json({ message: "Zaktualizowano listę", list: updated });
  } catch (error) {
    res.status(500).json({ message: "Błąd aktualizacji", error: error.message });
  }
});

// USUWANIE LISTY (DELETE) - soft delete
router.delete("/:id", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = req.params.id;
  try {
    const existing = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!existing) return res.status(404).json({ message: "Nie znaleziono listy" });

    await req.db.run(`UPDATE lists SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [listId]);
    await req.db.run(`UPDATE items SET deleted_at = CURRENT_TIMESTAMP WHERE list_id = ?`, [listId]);

    res.json({ message: "Lista została usunięta" });
  } catch (error) {
    res.status(500).json({ message: "Błąd usuwania", error: error.message });
  }
});

module.exports = router;
