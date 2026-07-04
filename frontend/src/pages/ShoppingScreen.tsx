import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// UI
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
// TYPES
import { type ShoppingListData, type ShoppingItem } from "@shared/types";

export function ShoppingScreen() {
  const { id } = useParams();
  const queryClient = useQueryClient(); // Potrzebne do odświeżenia cache'u

  // 1. POBIERANIE DANYCH LISTY
  const { data, isLoading, error } = useQuery<ShoppingListData>({
    queryKey: ["shoppingList", id],
    queryFn: async () => {
      const response = await fetch(`/api/shopping-lists/${id}`);
      if (!response.ok) throw new Error("Błąd pobierania");
      return response.json();
    },
    enabled: !!id,
  });

  // 2. MUTACJA DO ZMIANY STATUSU PRZEDMIOTU
  const toggleItemMutation = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: number; completed: boolean }) => {
      const response = await fetch(`/api/shopping-lists/${id}/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error("Nie udało się zaktualizować statusu");
      return response.json();
    },
    // Kiedy backend odpowie sukcesem:
    onSuccess: () => {
      // Mówimy TanStack Query: "Dane tej listy są nieaktualne, pobierz je z backendu jeszcze raz"
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      // Opcjonalnie odświeżamy główną listę (bo tam zmienia się completedCount)
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });

  if (isLoading) return <div>Ładowanie szczegółów...</div>;
  if (error || !data) return <div>Nie znaleziono listy.</div>;

  // 3. SEPARACJA PRZEDMIOTÓW (Bezpieczne mapowanie na wypadek braku tablicy items)
  const items = data.items || [];
  const toBuyItems = items.filter((item) => !item.completed);
  const purchasedItems = items.filter((item) => item.completed);

  return (
    <div className="shopping-lists-list h-full space-y-2 px-2 overflow-y-auto scrollbar-gutter-stable pt-[max(8px,env(safe-area-inset-top))]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/shopping-lists">Lista</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Accordion type="multiple" defaultValue={["purchased", "to_buy"]}>
        {/* HARMONIJKA: DO KUPIENIA */}
        <AccordionItem value="to_buy">
          <AccordionTrigger>Do kupienia ({toBuyItems.length})</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {toBuyItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={(completed) => toggleItemMutation.mutate({ itemId: item.id, completed })}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* HARMONIJKA: KUPIONE */}
        <AccordionItem value="purchased">
          <AccordionTrigger>Kupione ({purchasedItems.length})</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {purchasedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={(completed) => toggleItemMutation.mutate({ itemId: item.id, completed })}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// 4. ZAKTUALIZOWANY KOMPONENT KARTY
interface ItemCardProps {
  item: ShoppingItem;
  onToggle: (completed: boolean) => void;
}

function ItemCard({ item, onToggle }: ItemCardProps) {
  return (
    <Card
      className={`border-dashed border border-neutral-700 transition-colors ${
        item.completed ? "bg-neutral-800 line-through text-neutral-400" : "bg-neutral-900"
      } py-2`}
    >
      <CardContent className="px-4 pl-2 flex gap-2 items-center">
        {/* Kliknięcie w cały ten obszar przełącza stan na odwrotny */}
        <div
          className="left-wrap w-full flex items-center cursor-pointer select-none"
          onClick={() => onToggle(!item.completed)}
        >
          <div className="button h-10 aspect-square flex items-center justify-center">
            <input
              type="checkbox"
              readOnly
              checked={item.completed}
              className="size-4 accent-primary"
            />
          </div>
          <div className="column flex flex-col">
            <h1 className="font-medium text-sm">{item.name}</h1>
            {/* Opcjonalnie dodatkowy opis, np. ilość */}
            <h2 className="text-[10px] text-neutral-500">ID: {item.id}</h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
