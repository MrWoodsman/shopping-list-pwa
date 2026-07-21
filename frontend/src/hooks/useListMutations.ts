import { addListApi } from "@/api/lists";
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
