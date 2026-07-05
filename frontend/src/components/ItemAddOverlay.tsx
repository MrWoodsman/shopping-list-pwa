import { useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// UI - ZMIENIONE NA DRAWER
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ItemAddOverlayProps {
  id: string;
}

export function ItemAddOverlay({ id }: ItemAddOverlayProps) {
  const queryClient = useQueryClient();
  const [newItemName, setNewItemName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const addItemMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const response = await fetch(`/api/shopping-lists/${id}/item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Nie udało się dodać produktu");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
      setNewItemName("");
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant={"default"} onClick={(e) => e.currentTarget.blur()}>
          Dodaj +
        </Button>
      </DrawerTrigger>

      {/* DrawerContent automatycznie zarządza szerokością i blokuje "efekt gumki".
        Ustawiamy tylko wewnętrzne paddingi i tło.
      */}
      <DrawerContent className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 text-left">
          <DrawerTitle>Dodaj nowy produkt</DrawerTitle>
          <DrawerDescription>
            Wpisz nazwę rzeczy, którą chcesz dopisać do tej listy.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 py-2">
          <input
            type="text"
            placeholder="Np. Mleko 2%..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newItemName.trim() !== "") {
                addItemMutation.mutate({ name: newItemName });
              }
            }}
            // text-base (16px) nadal zostaje, aby blokować zoom w Safari
            className="border p-3 rounded-lg text-base text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            className="w-full h-11"
            disabled={addItemMutation.isPending || newItemName.trim() === ""}
            onClick={() => {
              if (newItemName.trim() === "") return;
              addItemMutation.mutate({ name: newItemName });
            }}
          >
            {addItemMutation.isPending ? "Zapisywanie..." : "Zapisz produkt"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
