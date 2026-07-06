const express = require("express");
const router = express.Router();
const { shoppingLists } = require("../data/store");

// POBRANIE WSZYSTKICH LIST DLA DANEJ GRUPY
router.get("/", (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy w zapytaniu" });

  // Filtrujemy tablicę - zwracamy tylko te listy, które należą do grupy użytkownika
  const groupLists = shoppingLists.filter((l) => l.groupId === groupId);
  res.json(groupLists);
});

// POBRANIE JEDNEJ LISTY
router.get("/:id", (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = parseInt(req.params.id);
  // Szukamy listy, która ma odpowiednie ID ORAZ należy do tej grupy
  const list = shoppingLists.find((l) => l.id === listId && l.groupId === groupId);

  if (list) {
    res.json(list);
  } else {
    res.status(404).json({ message: "Nie znaleziono listy lub brak dostępu" });
  }
});

// TWORZENIE NOWEJ LISTY (Nowy endpoint!)
router.post("/", (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const { name, icon } = req.body;

  const newList = {
    id: Date.now(),
    groupId: groupId, // Przypisujemy listę na sztywno do grupy!
    name: name || "Nowa lista",
    icon: icon || "🛒",
    itemsIn: 0,
    completedCount: 0,
    items: [],
  };

  shoppingLists.push(newList);
  res.status(201).json({ message: "Utworzono listę", list: newList });
});

// EDYCJA LISTY (PUT) - Zmiana nazwy
router.put("/:id", (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = parseInt(req.params.id);
  const { name } = req.body;

  // Szukamy listy i upewniamy się, że należy do grupy użytkownika
  const list = shoppingLists.find((l) => l.id === listId && l.groupId === groupId);
  if (!list) return res.status(404).json({ message: "Nie znaleziono listy" });

  // Aktualizujemy nazwę
  if (name) list.name = name;

  res.json({ message: "Zaktualizowano listę", list });
});

// USUWANIE LISTY (DELETE)
router.delete("/:id", (req, res) => {
  const groupId = req.headers["x-group-id"];
  if (!groupId) return res.status(401).json({ message: "Brak ID grupy" });

  const listId = parseInt(req.params.id);

  // Znajdujemy indeks listy, sprawdzając też grupę
  const listIndex = shoppingLists.findIndex((l) => l.id === listId && l.groupId === groupId);
  if (listIndex === -1) return res.status(404).json({ message: "Nie znaleziono listy" });

  // Usuwamy 1 element z tablicy
  shoppingLists.splice(listIndex, 1);

  res.json({ message: "Lista została usunięta" });
});

module.exports = router;
