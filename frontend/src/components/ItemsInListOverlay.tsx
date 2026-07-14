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

interface ItemsInListOverlayProps {
  listID: string;
  items?: any[]; // Opcjonalnie podmień 'any' na swój typ np. ShoppingItem, jeśli go eksportujesz
}

export function ItemsInListOverlay({ listID, items = [] }: ItemsInListOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. OBLICZAMY STANY DLA PRZYCISKÓW NA BAZIE PRZEKAZANYCH PRODUKTÓW
  const totalItems = items.length;
  const completedItems = items.filter((item) => item.completed).length;
  const uncompletedItems = totalItems - completedItems;

  // Logika wyłączania przycisków (true = zablokowany)
  const isListEmpty = totalItems === 0;
  const isEverythingBought = isListEmpty || uncompletedItems === 0;
  const isNothingBought = isListEmpty || completedItems === 0;

  // 2. WSPÓLNA FUNKCJA PO ZAKOŃCZENIU MUTACJI
  const onSuccessAction = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["shoppingList", listID] });
    toast.success(message);
    setIsOpen(false);
  };

  // 3. MUTACJE
  const markAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithGroup(`/api/shopping-lists/${listID}/items/mark-all`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Błąd oznaczania wszystkiego");
    },
    onSuccess: () => onSuccessAction("Wszystko zaznaczone jako kupione!"),
  });

  const resetAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithGroup(`/api/shopping-lists/${listID}/items/reset-all`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Błąd resetowania");
    },
    onSuccess: () => onSuccessAction("Odznaczono wszystkie produkty."),
  });

  const deleteCompletedMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithGroup(`/api/shopping-lists/${listID}/items/delete-completed`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Błąd usuwania");
    },
    onSuccess: () => onSuccessAction("Usunięto kupione produkty."),
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithGroup(`/api/shopping-lists/${listID}/items/delete-all`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Błąd czyszczenia listy");
    },
    onSuccess: () => onSuccessAction("Lista została całkowicie wyczyszczona."),
  });

  // 4. KOPIOWANIE DO SCHOWKA Z FALLBACKIEM (HTTP vs HTTPS)
  const handleCopyList = () => {
    if (isListEmpty) {
      toast.error("Lista jest pusta, nie ma czego kopiować.");
      return;
    }

    const textToCopy = items
      .map((item) => `${item.completed ? "☑" : "☐"} ${item.name} (${item.quantity} ${item.unit})`)
      .join("\n");

    const finalString = `🛒 *Lista zakupów*\n\n${textToCopy}`;

    // Sprawdzamy czy jesteśmy w bezpiecznym kontekście (HTTPS / localhost)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(finalString);
      toast.success("Skopiowano listę do schowka!");
      setIsOpen(false);
    } else {
      // Fallback dla lokalnego HTTP (np. po IP w sieci Wi-Fi)
      const textArea = document.createElement("textarea");
      textArea.value = finalString;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand("copy"); // Starsza, bardziej tolerancyjna metoda
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
        <Button variant="secondary" size="icon" onClick={(e) => e.currentTarget.blur()}>
          <Settings className="size-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 text-left pb-4">
          <DrawerTitle className="text-xl">Opcje listy</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-5">
          {/* BLOK 1: Opcje bezpieczne */}
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

          {/* BLOK 2: Strefa niebezpieczeństwa */}
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
