import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithGroup } from "@/utils/api";
import { toast } from "sonner";
import { type ShoppingListData } from "@shared/types";

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
      if (!response.ok) throw new Error("Nie udało się zaktualizować statusu");
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
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["shoppingList", id], context?.previousList);
      toast.error("Brak połączenia. Cofnięto zmianę.", {
        className: "bg-red-950! border-red-800! text-red-200!",
      });
    },

    // KROK 3: Po wszystkim, niezależnie od wyniku, synchronizujemy dla pewności
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};
