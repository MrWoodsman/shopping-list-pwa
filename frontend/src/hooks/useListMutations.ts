import { addListApi, addRecipeToListApi, deleteListApi, renameListApi } from "@/api/lists";
import { showErrorToast } from "@/utils/errorHandler";
import type { AddRecipeToListPayload } from "@shared/types";
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

// DODAWNIE PRZEPISU DO LISTY
export const useAddRecipeToListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddRecipeToListPayload) => addRecipeToListApi(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
      const targetId = data.targetListId || variables.target.list_id;
      if (targetId) queryClient.invalidateQueries({ queryKey: ["shoppingList", String(targetId)] });
    },
  });
};
