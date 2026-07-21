import { addListApi, deleteListApi, renameListApi } from "@/api/lists";
import { showErrorToast } from "@/utils/errorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// DODAWANIE LISTY
export const useAddListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => addListApi(name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
    onError: showErrorToast,
  });
};

// USUWANIE LISTY
export const useDeleteListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => deleteListApi(listId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
    onError: showErrorToast,
  });
};

// ZMIANA NAZWY LISTY
export const useRenameListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, newName }: { listId: string; newName: string }) =>
      renameListApi(listId, newName),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
      queryClient.invalidateQueries({ queryKey: ["shoppingList", String(variables.listId)] });
    },
  });
};
