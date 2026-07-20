import { fetchWithGroup } from "./api";

// ZMIANA STANU PRZEDMIOTU
export const toggleItemApi = async (listId: string, itemId: string, completed: boolean) => {
  const response = await fetchWithGroup(`/api/shopping-lists/${listId}/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Wystąpił nieznany błąd przy aktualizacji");
  }

  return response.json();
};

// DODAWNIE PRZEDMIOTÓW
export const addItemApi = async (listId: string, name: string, quantity: number, unit: string) => {
  const response = await fetchWithGroup(`/api/shopping-lists/${listId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity, unit }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Nie udało się dodać produktu");
  }

  return response.json();
};

// USUWANIE PRZEDMIOTÓW
export const deleteItemApi = async (listId: string, itemId: string) => {
  const response = await fetchWithGroup(`/api/shopping-lists/${listId}/items/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Nie udało się usunąć produktu");
  }

  return response.json();
};

// AKTUALIZACJA PRZEDMIOTÓW
export const updateItemApi = async (
  listId: string,
  itemId: string,
  data: { name: string; quantity: number; unit: string; completed: boolean },
) => {
  const response = await fetchWithGroup(`/api/shopping-lists/${listId}/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // Wysyłamy całą paczkę naraz!
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Nie udało się zapisać zmian");
  }
  return response.json();
};
