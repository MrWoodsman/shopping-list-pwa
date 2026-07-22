import { useQuery } from "@tanstack/react-query";
import { fetchAllShoppingListsApi } from "@/api/lists";

// POBIERANIE WSZYSTKICH LIST DLA GRUPY
export const useAllShoppingListsQuery = () => {
  return useQuery({
    queryKey: ["shoppingLists"],
    queryFn: fetchAllShoppingListsApi,
    refetchInterval: 5000,
  });
};
