import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchWithGroup } from "@/utils/api";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Settings, CheckCheck, RotateCcw, Copy, Trash2, Trash } from "lucide-react";
import { type ShoppingItem, type ShoppingListData } from "@shared/types";

interface ItemsInListOverlayProps {
  listID: string;
  items?: ShoppingItem[];
}

export function ItemsInListOverlay({ listID, items = [] }: ItemsInListOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const totalItems = items.length;
  const completedItems = items.filter((item) => item.completed).length;
  const uncompletedItems = totalItems - completedItems;

  const isListEmpty = totalItems === 0;
  const isEverythingBought = isListEmpty || uncompletedItems === 0;
  const isNothingBought = isListEmpty || completedItems === 0;

  // WSPÓLNA FUNKCJA PO ZAKOŃCZENIU MUTACJI
  const onSuccessAction = (message: string) => {
    toast.success(message);
    setIsOpen(false);
  };

  // ==========================================
  // MUTACJE Z OPTYMISTYCZNYM UI (Teraz używają ShoppingListData!)
  // ==========================================

  const markAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithGroup(`/api/shopping-lists/${listID}/items/mark-all`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Błąd oznaczania");
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList", listID] });
      const previousData = queryClient.getQueryData<ShoppingListData>(["shoppingList", listID]);

      queryClient.setQueryData(
        ["shoppingList", listID],
        (oldData: ShoppingListData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item) => ({ ...item, completed: true })),
            completedCount: oldData.items.length, // Optymistycznie aktualizujemy licznik!
          };
        },
      );
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData)
        queryClient.setQueryData(["shoppingList", listID], context.previousData);
      toast.error("Błąd: Nie udało się zaznaczyć wszystkiego.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["shoppingList", listID] }),
    onSuccess: () => onSuccessAction("Wszystko zaznaczone jako kupione!"),
  });

  const resetAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithGroup(`/api/shopping-lists/${listID}/items/reset-all`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Błąd resetowania");
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList", listID] });
      const previousData = queryClient.getQueryData<ShoppingListData>(["shoppingList", listID]);

      queryClient.setQueryData(
        ["shoppingList", listID],
        (oldData: ShoppingListData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item) => ({ ...item, completed: false })),
            completedCount: 0, // Optymistycznie zerujemy licznik
          };
        },
      );
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData)
        queryClient.setQueryData(["shoppingList", listID], context.previousData);
      toast.error("Błąd: Nie udało się zresetować listy.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["shoppingList", listID] }),
    onSuccess: () => onSuccessAction("Odznaczono wszystkie produkty."),
  });

  const deleteCompletedMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithGroup(`/api/shopping-lists/${listID}/items/delete-completed`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Błąd usuwania");
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList", listID] });
      const previousData = queryClient.getQueryData<ShoppingListData>(["shoppingList", listID]);

      queryClient.setQueryData(
        ["shoppingList", listID],
        (oldData: ShoppingListData | undefined) => {
          if (!oldData) return oldData;
          const remainingItems = oldData.items.filter((item) => !item.completed);
          return {
            ...oldData,
            items: remainingItems,
            itemsIn: remainingItems.length, // Zmniejszamy całkowitą liczbę produktów
            completedCount: 0, // Usuwamy kupione, więc licznik wynosi 0
          };
        },
      );
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData)
        queryClient.setQueryData(["shoppingList", listID], context.previousData);
      toast.error("Błąd: Nie udało się usunąć produktów.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["shoppingList", listID] }),
    onSuccess: () => onSuccessAction("Usunięto kupione produkty."),
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithGroup(`/api/shopping-lists/${listID}/items/delete-all`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Błąd czyszczenia");
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList", listID] });
      const previousData = queryClient.getQueryData<ShoppingListData>(["shoppingList", listID]);

      queryClient.setQueryData(
        ["shoppingList", listID],
        (oldData: ShoppingListData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: [],
            itemsIn: 0,
            completedCount: 0,
          };
        },
      );
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData)
        queryClient.setQueryData(["shoppingList", listID], context.previousData);
      toast.error("Błąd: Nie udało się wyczyścić listy.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["shoppingList", listID] }),
    onSuccess: () => onSuccessAction("Lista została całkowicie wyczyszczona."),
  });

  // ==========================================

  const handleCopyList = () => {
    if (isListEmpty) {
      toast.error("Lista jest pusta, nie ma czego kopiować.");
      return;
    }

    const textToCopy = items
      .map((item) => `${item.completed ? "☑" : "☐"} ${item.name} (${item.quantity} ${item.unit})`)
      .join("\n");

    const finalString = `🛒 *Lista zakupów*\n\n${textToCopy}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(finalString);
      toast.success("Skopiowano listę do schowka!");
      setIsOpen(false);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = finalString;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Skopiowano listę do schowka!");
      } catch (error) {
        toast.error("Przeglądarka zablokowała kopiowanie.", error!);
      } finally {
        textArea.remove();
        setIsOpen(false);
      }
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.blur()}
        >
          <Settings className="size-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 text-left pb-4">
          <DrawerTitle className="text-xl">Opcje listy</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-5">
          <div className="bg-secondary/80 rounded-xl overflow-hidden flex flex-col border border-border/50">
            <Button
              variant="ghost"
              className="justify-start h-13 rounded-none border-b border-border/50 font-medium"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending || isEverythingBought}
            >
              <CheckCheck className="mr-3 size-5 text-primary" />
              Zaznacz wszystko jako kupione
            </Button>

            <Button
              variant="ghost"
              className="justify-start h-13 rounded-none border-b border-border/50 font-medium"
              onClick={() => resetAllMutation.mutate()}
              disabled={resetAllMutation.isPending || isNothingBought}
            >
              <RotateCcw className="mr-3 size-5 text-primary" />
              Odznacz wszystko (Reset)
            </Button>

            <Button
              variant="ghost"
              className="justify-start h-13 rounded-none font-medium"
              onClick={handleCopyList}
              disabled={isListEmpty}
            >
              <Copy className="mr-3 size-5 text-foreground/70" />
              Kopiuj listę jako tekst
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-bold tracking-widest text-destructive uppercase px-2">
              Usuwanie danych
            </h3>

            <div className="bg-destructive/10 rounded-xl overflow-hidden flex flex-col border border-destructive/20">
              <Button
                variant="ghost"
                className="justify-start h-13 rounded-none border-b border-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive font-medium"
                onClick={() => deleteCompletedMutation.mutate()}
                disabled={deleteCompletedMutation.isPending || isNothingBought}
              >
                <Trash2 className="mr-3 size-5" />
                Usuń tylko kupione
              </Button>

              <Button
                variant="ghost"
                className="justify-start h-13 rounded-none text-destructive hover:bg-destructive/20 hover:text-destructive font-medium"
                onClick={() => deleteAllMutation.mutate()}
                disabled={deleteAllMutation.isPending || isListEmpty}
              >
                <Trash className="mr-3 size-5" />
                Usuń wszystkie produkty
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
