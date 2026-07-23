const express = require("express");
const router = express.Router();

// GET /api/v1/recipes -> Pobieranie wszystkich przepisów
router.get("/", async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  try {
    const recipes = await req.db.all(
      `SELECT 
          id, name, description, image_url, time_to_make, is_global, created_at, last_update
        FROM recipes 
        WHERE (group_id = ? OR is_global = 1) 
          AND deleted_at IS NULL
        ORDER BY created_at DESC`,
      [groupId],
    );

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
