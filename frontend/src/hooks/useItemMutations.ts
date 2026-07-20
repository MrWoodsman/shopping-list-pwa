import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addItemApi, toggleItemApi } from "@/api/items";
import { type ShoppingListData } from "@shared/types";
import { showErrorToast } from "@/utils/errorHandler";

// DODAWANIE PRZEDMIOTÓW
export const useAddItemMutation = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, quantity, unit }: { name: string; quantity: number; unit: string }) =>
      addItemApi(listId, name, quantity, unit),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", listId] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
    onError: showErrorToast,
  });
};

// ZMIANA STANU KUPIENIA
export const useToggleItemMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn jest teraz super krótkie!
    mutationFn: ({ itemId, completed }: { itemId: string; completed: boolean }) =>
      toggleItemApi(id, itemId, completed),

    onMutate: async ({ itemId, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList", id] });
      const previousList = queryClient.getQueryData<ShoppingListData>(["shoppingList", id]);

      queryClient.setQueryData<ShoppingListData>(["shoppingList", id], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map((item) => (item.id === itemId ? { ...item, completed } : item)),
        };
      });

      return { previousList };
    },

    onError: (err, _newTodo, context) => {
      queryClient.setQueryData(["shoppingList", id], context?.previousList);
      showErrorToast(err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};
