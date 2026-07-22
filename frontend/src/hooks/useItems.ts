import { useQuery } from "@tanstack/react-query";
import { fetchAllShoppingItemsApi } from "@/api/items";

// POBIERANIE WSZYSTKICH PRZEDMIOTÓW DLA GRUPY
export const useAllShoppingItemsQuery = () => {
  return useQuery({
    queryKey: ["shoppingItems", "all"],
    queryFn: fetchAllShoppingItemsApi,
    refetchInterval: 3000,
  });
};
