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
import { EllipsisVertical, Trash2, Pencil, X } from "lucide-react";
import { fetchWithGroup } from "@/utils/api";
import { showErrorToast } from "@/utils/errorHandler";

interface ListSettingsProps {
  listId: string | number;
  listName: string;
}

export function ListSettingsOverlay({ listId, listName }: ListSettingsProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Stany do edycji nazwy
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(listName);

  // MUTACJA: USUWANIE LISTY
  const deleteListMutation = useMutation({
    mutationFn: async () => {
      const response = await fetchWithGroup(`/api/shopping-lists/${listId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Nie udało się usunąć listy");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
      setIsOpen(false);
    },
    onError: showErrorToast,
  });

  // MUTACJA: ZMIANA NAZWY LISTY
  const renameListMutation = useMutation({
    mutationFn: async (updatedName: string) => {
      const response = await fetchWithGroup(`/api/shopping-lists/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedName }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Nie udało się zmienić nazwy");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
      queryClient.invalidateQueries({ queryKey: ["shoppingList", String(listId)] }); // W razie, gdybyśmy byli w środku tej listy
      setIsEditingName(false);
      setIsOpen(false);
    },
  });

  // Resetowanie stanu, gdy szuflada się zamyka (żeby po ponownym otwarciu nie było widać formularza)
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setIsEditingName(false), 300); // Czekamy na animację zamknięcia
      setNewName(listName);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-12 shrink-0 rounded-none"
          onClick={(e) => {
            e.stopPropagation(); // <-- TO JEST KLUCZ! Zatrzymuje kliknięcie przed pójściem wyżej
            e.currentTarget.blur(); // Zrzuca focus (żeby nie było błędu aria-hidden)
          }}
        >
          <EllipsisVertical className="size-5 text-primary" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 text-left pb-6">
          <DrawerTitle className="text-xl">
            {isEditingName ? "Zmień nazwę listy" : `Opcje: ${listName}`}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-2">
          {/* WIDOK 1: EDYCJA NAZWY */}
          {isEditingName ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="border p-3 rounded-lg text-base text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setIsEditingName(false)}
                >
                  <X className="size-4 mr-2" />
                  Anuluj
                </Button>
                <Button
                  className="flex-1 h-11"
                  disabled={renameListMutation.isPending || newName.trim() === ""}
                  onClick={() => renameListMutation.mutate(newName)}
                >
                  {renameListMutation.isPending ? "Zapisywanie..." : "Zapisz"}
                </Button>
              </div>
            </div>
          ) : (
            /* WIDOK 2: NORMALNE PRZYCISKI */
            <>
              <Button
                variant="secondary"
                className="justify-start h-14 text-base"
                onClick={() => setIsEditingName(true)}
              >
                <Pencil className="mr-3 size-5 text-primary" />
                Edytuj nazwę
              </Button>

              <Button
                variant="destructive"
                className="justify-start h-14 text-base mt-2"
                disabled={deleteListMutation.isPending}
                onClick={() => deleteListMutation.mutate()}
              >
                <Trash2 className="mr-3 size-5" />
                {deleteListMutation.isPending ? "Usuwanie..." : "Usuń listę"}
              </Button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
