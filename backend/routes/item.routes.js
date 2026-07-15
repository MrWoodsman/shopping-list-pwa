const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");

// ==============================================================
// 🔴 TRASY MASOWE (MUSZĄ BYĆ NA GÓRZE!)
// ==============================================================

// ZAZNACZ WSZYSTKO JAKO KUPIONE
router.put("/:listId/items/mark-all", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });
  const listId = req.params.listId;

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    // Zmieniamy na kupione tylko te, które nie są usunięte i nie są jeszcze kupione
    await req.db.run(
      `UPDATE items SET completed_at = datetime('now','localtime') WHERE list_id = ? AND completed_at IS NULL AND deleted_at IS NULL`,
      [listId],
    );

    res.json({ message: "Wszystkie produkty oznaczone jako kupione." });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ODZNACZ WSZYSTKO (RESET)
router.put("/:listId/items/reset-all", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });
  const listId = req.params.listId;

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    await req.db.run(
      `UPDATE items SET completed_at = NULL WHERE list_id = ? AND deleted_at IS NULL`,
      [listId],
    );

    res.json({ message: "Lista została zresetowana." });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// USUŃ TYLKO KUPIONE (Miękkie usuwanie)
router.delete("/:listId/items/delete-completed", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });
  const listId = req.params.listId;

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    await req.db.run(
      `UPDATE items SET deleted_at = CURRENT_TIMESTAMP WHERE list_id = ? AND completed_at IS NOT NULL AND deleted_at IS NULL`,
      [listId],
    );

    res.json({ message: "Usunięto kupione produkty." });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// USUŃ WSZYSTKIE PRODUKTY (Miękkie usuwanie)
router.delete("/:listId/items/delete-all", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });
  const listId = req.params.listId;

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    await req.db.run(
      `UPDATE items SET deleted_at = CURRENT_TIMESTAMP WHERE list_id = ? AND deleted_at IS NULL`,
      [listId],
    );

    res.json({ message: "Lista została wyczyszczona." });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

// ==============================================================
// 🟢 TRASY POJEDYNCZE (MUSZĄ BYĆ NA DOLE!)
// ==============================================================

// DODAWANIE PRODUKTU (POST)
router.post("/:listId/items", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });
  const listId = req.params.listId;

  // 1. ZMIANA: Używamy .trim() od razu przy pobieraniu danych
  const rawName = req.body.name || "";
  const name = rawName.trim();
  const { quantity = 1, unit = "szt." } = req.body;

  // 2. DODATKOWA WALIDACJA: Jeśli po trimie nazwa jest pusta, przerywamy
  if (!name) return res.status(400).json({ message: "Nazwa produktu nie może być pusta" });

  try {
    const list = await req.db.get(
      `SELECT id FROM lists WHERE id = ? AND group_id = ? AND deleted_at IS NULL`,
      [listId, groupId],
    );
    if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

    const id = randomUUID();

    // 3. UŻYWAMY OCZYSZCZONEJ ZMIENNEJ 'name'
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
// ZMIANA STATUSU I EDYCJA (PUT)
router.put("/:listId/items/:itemId", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = req.params.listId;
  const itemId = req.params.itemId;

  // Pobieramy wszystko prosto z body, bez wczesnego trim() i blokowania
  const { completed, quantity, unit, name } = req.body;

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

    const updates = [];
    const params = [];

    // 1. ZMIANA STATUSU (z checkboxa)
    if (typeof completed === "boolean") {
      updates.push(
        completed ? "completed_at = datetime('now','localtime')" : "completed_at = NULL",
      );
    }

    // 2. ZMIANA NAZWY (z okna edycji - odpala się tylko gdy wysłano nazwę)
    if (name !== undefined) {
      const cleanName = name.trim();
      if (!cleanName) return res.status(400).json({ message: "Nazwa produktu nie może być pusta" });

      updates.push("name = ?");
      params.push(cleanName);
    }

    // 3. ZMIANA ILOŚCI
    if (quantity !== undefined && quantity !== null && quantity !== "") {
      const numericQuantity = Number(quantity);
      if (Number.isNaN(numericQuantity)) {
        return res.status(400).json({ message: "Nieprawidłowa ilość" });
      }
      updates.push("quantity = ?");
      params.push(numericQuantity);
    }

    // 4. ZMIANA JEDNOSTKI
    if (unit !== undefined) {
      updates.push("unit = ?");
      params.push(unit.trim());
    }

    // Jeśli nie ma żadnych zmian do zapisania
    if (updates.length === 0) {
      const itemsInRow = await req.db.get(
        `SELECT COUNT(*) as cnt FROM items WHERE list_id = ? AND deleted_at IS NULL`,
        [listId],
      );
      const completedRow = await req.db.get(
        `SELECT COUNT(*) as cnt FROM items WHERE list_id = ? AND completed_at IS NOT NULL AND deleted_at IS NULL`,
        [listId],
      );
      return res.json({
        message: "Brak zmian",
        item: {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          completed: !!item.completed_at,
        },
        list: { id: listId, itemsIn: itemsInRow.cnt, completedCount: completedRow.cnt },
      });
    }

    // Wykonanie aktualizacji
    params.push(itemId);
    await req.db.run(`UPDATE items SET ${updates.join(", ")} WHERE id = ?`, params);

    // Pobranie zaktualizowanego przedmiotu
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

    // Podsumowanie listy
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
