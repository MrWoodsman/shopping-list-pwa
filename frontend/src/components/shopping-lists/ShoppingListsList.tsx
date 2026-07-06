import { useNavigate } from "react-router-dom";
// UI
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
// TYPE
import { type ShoppingListData } from "@shared/types";
import { ListSettingsOverlay } from "../ListSettingsOverlay";

type ShoppingListsListProps = {
  shoppingLists: ShoppingListData[];
  searchInput: string;
  isLoading: boolean;
};

export function ShoppingListsList({
  shoppingLists,
  searchInput,
  isLoading,
}: ShoppingListsListProps) {
  const navigate = useNavigate();

  if (isLoading) return <h1>Ładowanie</h1>;

  if (!shoppingLists || shoppingLists.length == 0)
    return <EmptyListPrompt searchInput={searchInput} />;

  return (
    <div className="shopping-lists-list h-full space-y-2 px-2 overflow-y-auto scrollbar-gutter-stable pb-[env(safe-area-bottom)]">
      {shoppingLists.map((el) => {
        const listCompletePercent = Math.floor((el.completedCount / el.itemsIn) * 100);
        return (
          // 1. Zdejmujemy onClick stąd! Karta to teraz tylko "pojemnik".
          <Card key={el.id}>
            <CardHeader>
              {/* 2. Tworzymy klikalną strefę na teksty (lewa strona) */}
              <div className="flex-1 cursor-pointer" onClick={() => navigate(`/shopping/${el.id}`)}>
                <CardTitle>{el.name}</CardTitle>
                <CardDescription>
                  {el.completedCount}/{el.itemsIn} |{" "}
                  {listCompletePercent ? listCompletePercent : "0"}%
                </CardDescription>
              </div>

              {/* 3. Prawa strona z przyciskiem opcji (odizolowana od nawigacji) */}
              <CardAction className="row-span-full! flex items-center justify-center h-full">
                <ListSettingsOverlay listId={el.id} listName={el.name} />
              </CardAction>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

function EmptyListPrompt({ searchInput }: { searchInput: string }) {
  return (
    <div className="h-full w-full p-4">
      {searchInput?.length == 0 ? (
        <Empty className="border border-dashed h-full">
          <EmptyHeader>
            <EmptyMedia variant="default"></EmptyMedia>
            <EmptyTitle>Jakoś tu pusto...</EmptyTitle>
            <EmptyDescription>Nie znaleziono żadnej listy zakupowej</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Dodaj liste </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <Empty className="border border-dashed h-full">
          <EmptyHeader>
            <EmptyMedia variant="default"></EmptyMedia>
            <EmptyTitle>Nic nie znaleziono</EmptyTitle>
            <EmptyDescription className="text-balance">
              Nie znaleziono pasującej listy do `
              <span className="font-mono text-neutral-300">{searchInput}</span>`
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Dodaj liste </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
