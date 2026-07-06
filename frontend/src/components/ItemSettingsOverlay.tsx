import { useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EllipsisVertical, Trash2, Pencil, Hash } from "lucide-react";
import { type ShoppingItem } from "@shared/types"; // Upewnij się, że ścieżka jest poprawna
import { fetchWithGroup } from "@/utils/api";

interface ItemSettingsProps {
  listId: string;
  item: ShoppingItem;
}

export function ItemSettingsOverlay({ listId, item }: ItemSettingsProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // MUTACJA DO USUWANIA PRODUKTU
  const deleteItemMutation = useMutation({
    mutationFn: async () => {
      // Pamiętaj o użyciu odpowiedniego endpointu (DELETE)
      const response = await fetchWithGroup(`/api/shopping-lists/${listId}/items/${item.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Nie udało się usunąć produktu");
      return response.json();
    },
    onSuccess: () => {
      // Odświeżamy listę i zamykamy szufladę
      queryClient.invalidateQueries({ queryKey: ["shoppingList", listId] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* TRIGGER - Twoje 3 kropki */}
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-auto w-12 shrink-0 rounded-none"
          onClick={(e) => e.currentTarget.blur()}
        >
          <EllipsisVertical className="size-5 text-neutral-400" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 text-left pb-6">
          <DrawerTitle className="text-xl">Opcje: {item.name}</DrawerTitle>
        </DrawerHeader>

        {/* LISTA PRZYCISKÓW / OPCJI */}
        <div className="flex flex-col gap-2">
          {/* Zmiana ilości - UI */}
          <Button variant="secondary" className="justify-start h-14 text-base" disabled>
            <Hash className="mr-3 size-5 text-primary" />
            Zmień ilość (wkrótce)
          </Button>

          {/* Zmiana nazwy - UI */}
          <Button variant="secondary" className="justify-start h-14 text-base" disabled>
            <Pencil className="mr-3 size-5 text-primary" />
            Edytuj nazwę (wkrótce)
          </Button>

          {/* Usuwanie - uderza w mutację */}
          <Button
            variant="destructive"
            className="justify-start h-14 text-base mt-2"
            disabled={deleteItemMutation.isPending}
            onClick={() => deleteItemMutation.mutate()}
          >
            <Trash2 className="mr-3 size-5" />
            {deleteItemMutation.isPending ? "Usuwanie..." : "Usuń produkt"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
