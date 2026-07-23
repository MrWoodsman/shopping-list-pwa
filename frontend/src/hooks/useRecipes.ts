import { fetchAllRecipesApi } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

// POBIERANIE WSZYSTKICH PRZEPISÓW DOSTPENYCH DLA GRUPY [GLOBAL + LOCAL DLA GRUPY]
export const useAllRecipesQuery = () => {
  return useQuery({
    queryKey: ["recipesAll"],
    queryFn: fetchAllRecipesApi,
    refetchInterval: 5000,
  });
};
