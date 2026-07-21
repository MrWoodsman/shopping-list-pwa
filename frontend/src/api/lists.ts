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
