import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useNavigate } from "react-router-dom";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import type { ShoppingListData } from "@/pages/ShoppingLists";

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
    <div className="shopping-lists-list h-full space-y-2 px-2 overflow-y-auto scrollbar-gutter-stable pb-[env(safe-area-inset-bottom)]">
      {shoppingLists.map((el) => {
        const listCompletePercent = Math.floor((el.completedCount / el.itemsIn) * 100);
        return (
          <Card key={el.id} onClick={() => navigate(`/shopping/${el.id}`)}>
            <CardHeader>
              <CardTitle>{el.name}</CardTitle>
              <CardDescription>
                {el.completedCount}/{el.itemsIn} | {listCompletePercent}%
              </CardDescription>
              <CardAction className="row-span-full! flex items-center justify-center h-full">
                {">"}
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
