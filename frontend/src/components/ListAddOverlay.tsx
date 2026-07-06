import { useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { fetchWithGroup } from "@/utils/api";
import { Plus } from "lucide-react"; // Importujemy ikonkę plusa

// Usunęliśmy id z propsów, komponent nie przyjmuje już żadnych argumentów
export function ListAddOverlay() {
  const queryClient = useQueryClient();
  const [newListName, setNewListName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // MUTACJA DO TWORZENIA NOWEJ LISTY
  const addListMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      // Uderzamy prosto w główny endpoint list zakupów
      const response = await fetchWithGroup(`/api/shopping-lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Nie udało się utworzyć listy");
      return response.json();
    },
    onSuccess: () => {
      // Odświeżamy tylko główną tablicę list, bo to na niej jesteśmy
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
      setNewListName("");
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {/* Przycisk zmieniony na okrągły z ikoną plusa */}
        <Button variant="default" onClick={(e) => e.currentTarget.blur()}>
          Dodaj <Plus className="size-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 text-left">
          <DrawerTitle>Utwórz nową listę</DrawerTitle>
          <DrawerDescription>Wpisz nazwę dla swojej nowej listy zakupów.</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 py-2">
          <input
            type="text"
            placeholder="Np. Biedronka, Do domu, Remont..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newListName.trim() !== "") {
                addListMutation.mutate({ name: newListName });
              }
            }}
            className="border p-3 rounded-lg text-base text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            className="w-full h-11"
            disabled={addListMutation.isPending || newListName.trim() === ""}
            onClick={() => {
              if (newListName.trim() === "") return;
              addListMutation.mutate({ name: newListName });
            }}
          >
            {addListMutation.isPending ? "Tworzenie..." : "Utwórz listę"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
