// src/hooks/useCreateRecipe.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipeApi, deleteRecipeApi, updateRecipeApi } from "@/api/recipes";
import { showErrorToast } from "@/utils/errorHandler";

// TWORZENIE PRZEPISU
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

// AKTUALIZACJA PRZEPISU
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

// USUWANIE PRZEPISU
export const useDeleteRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecipeApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: showErrorToast,
  });
};
