import type { ShoppingListData } from "@shared/types";
import { fetchWithGroup } from "./api";

// DODAWANIE LISTY
export const addListApi = async (name: string) => {
  const response = await fetchWithGroup(`/api/shopping-lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Nie udało się utworzyć listy");
  }

  return response.json();
};

// USUWANIE LISTY
export const deleteListApi = async (listId: string) => {
  const response = await fetchWithGroup(`/api/shopping-lists/${listId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Nie udało się usunąć listy");
  }

  return response.json();
};

// ZMIANA NAZWY LISTY
export const renameListApi = async (listId: string, updatedName: string) => {
  const response = await fetchWithGroup(`/api/shopping-lists/${listId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: updatedName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Nie udało się zmienić nazwy");
  }

  return response.json();
};

// POBIERANIE WSZYSTKICH LIST
export const fetchAllShoppingListsApi = async (): Promise<ShoppingListData[]> => {
  const response = await fetchWithGroup("/api/shopping-lists");

  if (!response.ok) throw new Error("Błąd pobierania");

  return response.json();
};

// POBRANIE WYBRANEJ LISTY
export const fetchShoppingListApi = async (listId: string): Promise<ShoppingListData> => {
  const response = await fetchWithGroup(`/api/shopping-lists/${listId}`);

  if (!response.ok) throw new Error("Błąd pobierania");

  return response.json();
};
