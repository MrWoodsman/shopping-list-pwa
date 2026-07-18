import { fetchWithGroup } from "./api";

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
