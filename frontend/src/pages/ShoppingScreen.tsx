import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
// UI
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
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
import { ItemAddOverlay } from "@/components/ItemAddOverlay";
import { ItemSettingsOverlay } from "@/components/ItemSettingsOverlay";
import { fetchWithGroup } from "@/utils/api";
import { Checkbox } from "@/components/ui/checkbox";
import { ItemsInListOverlay } from "@/components/ItemsInListOverlay";

export function ShoppingScreen() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // 1. POBIERANIE DANYCH LISTY
  const { data, isLoading, error } = useQuery<ShoppingListData>({
    queryKey: ["shoppingList", id],
    queryFn: async () => {
      const response = await fetchWithGroup(`/api/shopping-lists/${id}`);
      if (!response.ok) throw new Error("Błąd pobierania");
      return response.json();
    },
    enabled: !!id,
    refetchInterval: 3000,
  });

  // 2. MUTACJA DO ZMIANY STATUSU PRZEDMIOTU (Optymistyczna)
  const toggleItemMutation = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
      const response = await fetchWithGroup(`/api/shopping-lists/${id}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error("Nie udało się zaktualizować statusu");
      return response.json();
    },

    // KROK 1: Odpala się NATYCHMIAST po kliknięciu checkboxa
    onMutate: async ({ itemId, completed }) => {
      // Przerywamy ewentualne pobieranie w tle, żeby nie nadpisało naszej świeżej zmiany
      await queryClient.cancelQueries({ queryKey: ["shoppingList", id] });

      // Zapisujemy obecny stan listy jako "Kopię Zapasową" (Snapshot)
      const previousList = queryClient.getQueryData<ShoppingListData>(["shoppingList", id]);

      // Optymistycznie modyfikujemy cache – dla użytkownika produkt odhacza się w 0.001s
      queryClient.setQueryData<ShoppingListData>(["shoppingList", id], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map((item) => (item.id === itemId ? { ...item, completed } : item)),
        };
      });

      // Zwracamy kopię zapasową, żeby onError miało do czego wracać
      return { previousList };
    },

    // KROK 2: Jeśli serwer odrzuci akcję lub braknie neta (Rollback)
    onError: (_err, _newTodo, context) => {
      // Przywracamy starą listę
      queryClient.setQueryData(["shoppingList", id], context?.previousList);

      // Wywalamy czerwony komunikat z Sonnera
      toast.error("Brak połączenia. Cofnięto zmianę.", {
        className: "bg-red-950! border-red-800! text-red-200!",
      });
    },

    // KROK 3: Po wszystkim, niezależnie od wyniku, synchronizujemy dla pewności
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });

  if (isLoading) return <div>Ładowanie szczegółów...</div>;
  if (error || !data) return <div>Nie znaleziono listy.</div>;

  const items = data.items || [];
  const toBuyItems = items.filter((item) => !item.completed);
  const purchasedItems = items.filter((item) => item.completed);

  return (
    <div className="shopping-lists-list h-full flex flex-col bg-background">
      {/* TOP NAVIGATION */}
      <div className="pt-[max(8px,env(safe-area-inset-top))] px-2 pb-2 bg-background border-b z-50 flex items-center justify-between gap-3 shrink-0">
        <Breadcrumb className="flex-1 min-w-0">
          <BreadcrumbList className="flex-nowrap min-w-0 gap-1">
            <BreadcrumbItem className="shrink-0">
              <BreadcrumbLink asChild>
                <Link to="/shopping-lists">Lista</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="shrink-0" />

            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate block">{data.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-1 shrink-0">
          <ItemsInListOverlay listID={id!} items={data?.items || []} />
          <ItemAddOverlay id={id!} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-2 space-y-2 scrollbar-gutter-stable pb-4">
        <Accordion type="multiple" defaultValue={["purchased", "to_buy"]}>
          {/* ... DO KUPIENIA ... */}
          <AccordionItem value="to_buy">
            <AccordionTrigger>Do kupienia ({toBuyItems.length})</AccordionTrigger>
            <AccordionContent className="flex flex-col pt-1 pb-3 h-fit">
              <AnimatePresence initial={false}>
                {toBuyItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    style={{ overflow: "hidden" }}
                  >
                    <ItemCard
                      listId={id!}
                      item={item}
                      onToggle={(completed) =>
                        toggleItemMutation.mutate({ itemId: item.id, completed })
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>

          {/* ... KUPIONE ... */}
          <AccordionItem value="purchased">
            <AccordionTrigger>Kupione ({purchasedItems.length})</AccordionTrigger>
            <AccordionContent className="flex flex-col pt-1 pb-3 h-fit">
              <AnimatePresence initial={false}>
                {purchasedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    style={{ overflow: "hidden" }}
                  >
                    <ItemCard
                      listId={id!}
                      item={item}
                      onToggle={(completed) =>
                        toggleItemMutation.mutate({ itemId: item.id, completed })
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

interface ItemCardProps {
  listId: string;
  item: ShoppingItem;
  onToggle: (completed: boolean) => void;
}

function ItemCard({ listId, item, onToggle }: ItemCardProps) {
  return (
    <Card
      className={`border-dashed border border-foreground/20 overflow-hidden transition-colors duration-200 ${
        item.completed ? "bg-foreground/7.5 text-primary" : "bg-foreground/7.5"
      } py-0`}
    >
      <CardContent className="px-2 pr-0 flex gap-2 items-stretch relative">
        <div
          className="left-wrap w-full py-1 flex items-center cursor-pointer select-none"
          onClick={() => onToggle(!item.completed)}
        >
          <div className="button h-10 aspect-square flex items-center justify-center">
            <Checkbox
              checked={item.completed}
              className="size-4.5 border-foreground/25 bg-foreground/2.5"
            />
          </div>
          <div className="column flex flex-col">
            <h1 className={`font-medium text-sm ${item.completed && "line-through"}`}>
              {item.name}
            </h1>
            {/* <h2 className="text-[10px] text-neutral-500">ID: {item.id}</h2> */}
            <h2 className="text-[12px] text-primary/60">
              {item.quantity} {item.unit}
            </h2>
          </div>
        </div>

        <ItemSettingsOverlay listId={listId!} item={item} />
      </CardContent>
    </Card>
  );
}
