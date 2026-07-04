import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
// TYPES
import { type ShoppingListData } from "@shared/types";

export function ShoppingScreen() {
  const { id } = useParams();

  console.log(`Pobieranie danych o ${id}`);

  const { data, isLoading, error } = useQuery<ShoppingListData>({
    queryKey: ["shoppingList", id],
    queryFn: async () => {
      const response = await fetch(`/api/shopping-lists/${id}`);
      if (!response.ok) throw new Error("Błąd pobierania");
      return response.json();
    },
    enabled: !!id, // Zapytanie wykona się tylko jeśli id istnieje
  });

  if (isLoading) return <div>Ładowanie szczegółów...</div>;
  if (error || !data) return <div>Nie znaleziono listy.</div>;

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

      <Accordion type="multiple" defaultValue={["to_buy"]}>
        <AccordionItem value="purchased">
          <AccordionTrigger>Kupione</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {/* LISTA JUZ KUPIONYCH PRZEDMIOTÓW */}
            <div className="bg-neutral-500 p-2 rounded-2xl">
              <h1>test</h1>
            </div>
            <div className="bg-neutral-500 p-2 rounded-2xl">
              <h1>test</h1>
            </div>
            <div className="bg-neutral-500 p-2 rounded-2xl">
              <h1>test</h1>
            </div>
            <div className="bg-neutral-500 p-2 rounded-2xl">
              <h1>test</h1>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="to_buy">
          <AccordionTrigger>Do kupienia</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {/* LISTA JUZ KUPIONYCH PRZEDMIOTÓW */}
            <div className="bg-neutral-500 p-2 rounded-2xl">
              <h1>test</h1>
            </div>
            <div className="bg-neutral-500 p-2 rounded-2xl">
              <h1>test</h1>
            </div>
            <div className="bg-neutral-500 p-2 rounded-2xl">
              <h1>test</h1>
            </div>
            <div className="bg-neutral-500 p-2 rounded-2xl">
              <h1>test</h1>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <p>Data utworzenia: {data.createdAt}</p> */}
    </div>
  );
}
