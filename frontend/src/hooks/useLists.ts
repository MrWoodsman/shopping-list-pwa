import { useQuery } from "@tanstack/react-query";
import { fetchAllShoppingListsApi, fetchShoppingListApi } from "@/api/lists";

// POBIERANIE WSZYSTKICH LIST DLA GRUPY
export const useAllShoppingListsQuery = () => {
  return useQuery({
    queryKey: ["shoppingLists"],
    queryFn: fetchAllShoppingListsApi,
    refetchInterval: 5000,
  });
};

// POBIERANIE WYBRANEJ LISTY
export const useShoppingListQuery = (listId: string) => {
  return useQuery({
    queryKey: ["shoppingList", listId],
    queryFn: () => fetchShoppingListApi(listId),
    refetchInterval: 3000,
  });
};
