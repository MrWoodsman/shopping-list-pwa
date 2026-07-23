import type { RecipeItem } from "@shared/types";
import { fetchWithGroup } from "./api";

// POBRANIE WSZYSTKICH DOSTPENYCH PRZEPDEISOW DLA GRUPY
export const fetchAllRecipesApi = async (): Promise<RecipeItem[]> => {
  const response = await fetchWithGroup(`/api/v1/recipes/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Wystąpił nieznany błąd przy pobieraniu danych");
  }

  return response.json();
};
