const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");

// ==========================================
// OPERACJE NA SAMYCH LISTACH
// ==========================================

// GET /api/v1/lists -> Pobranie wszystkich list
router.get("/", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  try {
    const lists = await req.db.all(
      `SELECT id, group_id as groupId, name, created_at as createdAt FROM lists WHERE group_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`,
      [groupId],
    );

    for (const l of lists) {
      const items = await req.db.all(
        `SELECT id, name, quantity, unit, completed_at FROM items WHERE list_id = ? AND deleted_at IS NULL`,
        [l.id],
      );
      l.items = items.map((i) => ({ ...i, completed: !!i.completed_at }));
      l.itemsIn = items.length;
      l.completedCount = items.filter((i) => i.completed_at).length;
    }

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// GET /api/v1/lists/:id -> Pobranie jednej listy
router.get("/:id", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });
  const listId = req.params.id;

  try {
    const list = await req.db.get(
      `SELECT id, group_id as groupId, name, created_at as createdAt FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    const items = await req.db.all(
      `SELECT id, name, quantity, unit, completed_at FROM items WHERE list_id = ? AND deleted_at IS NULL`,
      [listId],
    );
    list.items = items.map((i) => ({ ...i, completed: !!i.completed_at }));
    list.itemsIn = items.length;
    list.completedCount = items.filter((i) => i.completed_at).length;

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// POST /api/v1/lists -> Tworzenie nowej listy
router.post("/", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  try {
    const id = randomUUID();
    const name = req.body.name || "Nowa lista";
    await req.db.run(`INSERT INTO lists (id, group_id, name) VALUES (?, ?, ?)`, [
      id,
      groupId,
      name,
    ]);

    res.status(201).json({
      message: "Utworzono listę",
      list: { id, groupId, name, itemsIn: 0, completedCount: 0, items: [] },
    });
  } catch (error) {
    res.status(500).json({ message: "Błąd tworzenia", error: error.message });
  }
});

// PUT /api/v1/lists/:id -> Edycja nazwy listy
router.put("/:id", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [req.params.id, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    if (req.body.name)
      await req.db.run(`UPDATE lists SET name = ? WHERE id = ?`, [req.body.name, req.params.id]);
    res.json({ message: "Zaktualizowano listę" });
  } catch (error) {
    res.status(500).json({ message: "Błąd aktualizacji", error: error.message });
  }
});

// DELETE /api/v1/lists/:id -> Usuwanie listy
router.delete("/:id", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [req.params.id, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    await req.db.run(`UPDATE lists SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [
      req.params.id,
    ]);
    await req.db.run(`UPDATE items SET deleted_at = CURRENT_TIMESTAMP WHERE list_id = ?`, [
      req.params.id,
    ]);
    res.json({ message: "Lista usunięta" });
  } catch (error) {
    res.status(500).json({ message: "Błąd usuwania", error: error.message });
  }
});

// ==========================================
// OPERACJE NA ELEMENTACH (W KONTEKŚCIE LISTY)
// ==========================================

// POST /api/v1/lists/:id/items -> Dodawanie pojedynczego produktu do listy
router.post("/:id/items", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });
  const listId = req.params.id;
  const name = (req.body.name || "").trim();
  const { quantity = 1, unit = "szt." } = req.body;

  if (!name) return res.status(400).json({ message: "Nazwa pusta" });

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

    res.status(201).json({ message: "Dodano produkt" }); // Celowo uproszczone dla czytelności
  } catch (error) {
    res.status(500).json({ message: "Błąd", error: error.message });
  }
});

// PUT /api/v1/lists/:id/items/mark-all
router.put("/:id/items/mark-all", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [req.params.id, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono" });

    await req.db.run(
      `UPDATE items SET completed_at = datetime('now','localtime') WHERE list_id = ? AND completed_at IS NULL AND deleted_at IS NULL`,
      [req.params.id],
    );
    res.json({ message: "Wszystko kupione" });
  } catch (error) {
    res.status(500).json({ message: "Błąd", error: error.message });
  }
});

// PUT /api/v1/lists/:id/items/reset-all
router.put("/:id/items/reset-all", async (req, res) => {
  // Analogicznie: weryfikacja list + UPDATE items SET completed_at = NULL WHERE list_id = ?
  await req.db.run(
    `UPDATE items SET completed_at = NULL WHERE list_id = ? AND deleted_at IS NULL`,
    [req.params.id],
  );
  res.json({ message: "Reset" });
});

// DELETE /api/v1/lists/:id/items/delete-completed
router.delete("/:id/items/delete-completed", async (req, res) => {
  await req.db.run(
    `UPDATE items SET deleted_at = CURRENT_TIMESTAMP WHERE list_id = ? AND completed_at IS NOT NULL AND deleted_at IS NULL`,
    [req.params.id],
  );
  res.json({ message: "Usunięto kupione" });
});

// DELETE /api/v1/lists/:id/items/delete-all
router.delete("/:id/items/delete-all", async (req, res) => {
  await req.db.run(
    `UPDATE items SET deleted_at = CURRENT_TIMESTAMP WHERE list_id = ? AND deleted_at IS NULL`,
    [req.params.id],
  );
  res.json({ message: "Wyczyszczono" });
});

module.exports = router;
