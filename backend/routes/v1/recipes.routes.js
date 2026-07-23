const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const multer = require("multer");

// KONFIGURACJA ZAPISU PLIKÓW
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/recipes/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, randomUUID() + ext);
  },
});

const upload = multer({ storage: storage });

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

// POST /api/v1/recipes -> Dodawanie przepisów
router.post("/", upload.single("image"), async (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const { name, description, time_to_make, is_global } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Nazwa jest wymagana" });
  }

  // Budujemy ścieżkę do zdjęcia
  let imageUrl = "";
  if (req.file) {
    imageUrl = `/images/recipes/${req.file.filename}`;
  }

  try {
    const id = randomUUID();
    const isGlobalValue = is_global === "true" || is_global === true ? 1 : 0;

    await req.db.run(
      `INSERT INTO recipes (id, group_id, name, description, image_url, time_to_make, is_global) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, groupId, name.trim(), description || "", imageUrl, time_to_make || 0, isGlobalValue],
    );

    res.status(201).json({ message: "Dodano przepis", id, imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

module.exports = router;
