import { fetchAllRecipesApi, fetchRecipeDetailsApi } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

// POBIERANIE WSZYSTKICH PRZEPISÓW DOSTPENYCH DLA GRUPY [GLOBAL + LOCAL DLA GRUPY]
export const useAllRecipesQuery = () => {
  return useQuery({
    queryKey: ["recipesAll"],
    queryFn: fetchAllRecipesApi,
    refetchInterval: 5000,
  });
};

export const useRecipeDetailsQuery = (recipeId: string | null) => {
  return useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipeDetailsApi(recipeId!),
    enabled: Boolean(recipeId),
    // Opcjonalnie: dane nie stają się "przestarzałe" natychmiast po pobraniu (przydatne przy edycji)
    staleTime: 1000 * 60 * 5, // 5 minut
  });
};
