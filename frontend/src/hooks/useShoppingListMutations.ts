import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithGroup } from "@/utils/api";
import { type ShoppingListData } from "@shared/types";
import { showErrorToast } from "@/utils/errorHandler";

// TWOJA FUNKCJA STRZAŁKOWA ZACZYNA SIĘ TUTAJ:
export const useToggleItemMutation = (id: string) => {
  const queryClient = useQueryClient();

  // Zwracamy całą konfigurację mutacji
  return useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
      const response = await fetchWithGroup(`/api/shopping-lists/${id}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Wystąpił nieznany błąd przy aktualizacji");
      }

      return response.json();
    },

    // KROK 1: Odpala się NATYCHMIAST po kliknięciu checkboxa
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

    // KROK 2: Jeśli serwer odrzuci akcję lub braknie neta (Rollback)
    onError: (err, _newTodo, context) => {
      queryClient.setQueryData(["shoppingList", id], context?.previousList);
      showErrorToast(err);
    },

    // KROK 3: Po wszystkim, niezależnie od wyniku, synchronizujemy dla pewności
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};
