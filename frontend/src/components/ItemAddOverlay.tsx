import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { fetchWithGroup } from "@/utils/api";
import { Plus } from "lucide-react";

interface ItemAddOverlayProps {
  id: string; // ID listy
}

const UNITS = ["szt.", "kg", "g", "l", "ml", "opak."];

export function ItemAddOverlay({ id }: ItemAddOverlayProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null); // Ref, żeby przywrócić focus
  const focusInput = () => {
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("szt.");
  const [keepOpen, setKeepOpen] = useState(false); // Nasz checkbox
  const fieldClass =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-primary";

  useEffect(() => {
    if (isOpen) {
      focusInput();
    }
  }, [isOpen]);

  const addItemMutation = useMutation({
    mutationFn: async ({ name, qty, un }: { name: string; qty: number; un: string }) => {
      const response = await fetchWithGroup(`/api/shopping-lists/${id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Wysyłamy wszystko do API
        body: JSON.stringify({ name, quantity: qty, unit: un }),
      });
      if (!response.ok) throw new Error("Nie udało się dodać produktu");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });

      // Czyszczenie formularza
      setNewItemName("");
      setQuantity("1");
      // Celowo nie resetujemy 'unit', bo często dodaje się ciągiem warzywa (kg) albo napoje (l)

      if (!keepOpen) {
        setIsOpen(false);
      } else {
        // Jeśli okienko zostaje, przywracamy migający kursor do inputa z nazwą!
        focusInput();
      }
    },
  });

  const handleSubmit = () => {
    if (newItemName.trim() === "") return;
    addItemMutation.mutate({
      name: newItemName,
      qty: parseFloat(quantity) || 1,
      un: unit,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant={"default"} onClick={(e) => e.currentTarget.blur()}>
          Dodaj <Plus className="size-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          focusInput();
        }}
      >
        <DrawerHeader className="px-0 text-left">
          <DrawerTitle>Dodaj nowy produkt</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Główny input na nazwę */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Np. Mleko 2%..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className={fieldClass}
          />

          {/* Rząd z ilością i jednostką - ZMIENIONO NA GRID */}
          <div className="grid grid-cols-2 gap-2 items-stretch">
            <input
              type="number"
              min="0.1"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`${fieldClass} text-center`}
            />

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className={`${fieldClass} appearance-none text-center`}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox "Dodaj kolejny" */}
          <label className="flex items-center gap-3 py-2 cursor-pointer select-none">
            <div className="flex items-center justify-center h-6 w-6 rounded border border-neutral-700 bg-neutral-900">
              <input
                type="checkbox"
                checked={keepOpen}
                onChange={(e) => setKeepOpen(e.target.checked)}
                className="size-4 accent-primary cursor-pointer"
              />
            </div>
            <span className="text-sm text-neutral-300">Dodawaj wiele produktów z rzędu</span>
          </label>

          <Button
            className="w-full h-11 mt-2"
            disabled={addItemMutation.isPending || newItemName.trim() === ""}
            onClick={handleSubmit}
          >
            {addItemMutation.isPending ? "Zapisywanie..." : "Zapisz produkt"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
