// src/hooks/useCreateRecipe.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipeApi, updateRecipeApi } from "@/api/recipes";
import { showErrorToast } from "@/utils/errorHandler";

export const useCreateRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createRecipeApi(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: showErrorToast,
  });
};

export const useUpdateRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateRecipeApi({ id, formData }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: showErrorToast,
  });
};
