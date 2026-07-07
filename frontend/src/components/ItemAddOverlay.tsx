import { useRef, useState } from "react";
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
  id: string;
}

const UNITS = ["szt.", "kg", "g", "l", "ml", "opak."];

export function ItemAddOverlay({ id }: ItemAddOverlayProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("szt.");
  const [keepOpen, setKeepOpen] = useState(false);

  const fieldClass =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-primary";

  const addItemMutation = useMutation({
    mutationFn: async ({ name, qty, un }: { name: string; qty: number; un: string }) => {
      const response = await fetchWithGroup(`/api/shopping-lists/${id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity: qty, unit: un }),
      });
      if (!response.ok) throw new Error("Nie udało się dodać produktu");
      return response.json();
    },
    onSuccess: () => {
      // Odświeżamy dane w tle
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });

      // Zamykamy Drawer tylko, jeśli keepOpen jest wyłączone
      // Jeśli jest włączone, formularz wyczyścił się już w handleSubmit!
      if (!keepOpen) {
        setIsOpen(false);
        setNewItemName("");
        setQuantity("1");
      }
    },
  });

  // Dodajemy e: React.FormEvent, żeby móc użyć preventDefault()
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // TO JEST KLUCZ! Zapobiega przeładowaniu i wymuszonemu zamknięciu klawiatury

    if (newItemName.trim() === "") return;

    // Kopiujemy dane przed wyczyszczeniem stanu
    const nameToSubmit = newItemName;
    const qtyToSubmit = parseFloat(quantity) || 1;
    const unitToSubmit = unit;

    // OPTYMICZNE CZYSZCZENIE:
    // Jeśli użytkownik chce dodać kolejny produkt, czyścimy ekran NATYCHMIAST.
    // Telefon nawet nie zauważy przerwy, więc klawiatura zostanie na miejscu.
    if (keepOpen) {
      setNewItemName("");
      setQuantity("1");
      // Utrzymujemy sztucznie focus, żeby klawiatura nie mignęła
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }

    // Wysyłamy dane do bazy w tle
    addItemMutation.mutate({
      name: nameToSubmit,
      qty: qtyToSubmit,
      un: unitToSubmit,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant={"default"} onClick={(e) => e.currentTarget.blur()}>
          Dodaj <Plus className="size-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 text-left">
          <DrawerTitle>Dodaj nowy produkt</DrawerTitle>
        </DrawerHeader>

        {/* ZMIANA: Zamiast <div>, używamy <form onSubmit={...}> */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Np. Mleko 2%..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            // USUNIĘTO onKeyDown! Formularz HTML sam wie, że "Enter" na klawiaturze to "Submit"
            className={fieldClass}
          />

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
            type="submit" // ZMIANA: Dodano typ submit
            className="w-full h-11 mt-2"
            disabled={addItemMutation.isPending && !keepOpen} // Wyłączamy przycisk tylko, jeśli okienko ma się zamknąć
          >
            {addItemMutation.isPending && !keepOpen ? "Zapisywanie..." : "Zapisz produkt"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
