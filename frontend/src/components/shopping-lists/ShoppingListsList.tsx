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

export function ShoppingListsList({
  shoppingLists = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
}) {
  if (!shoppingLists || shoppingLists.length == 0) return <EmptyListPrompt />;

  return (
    <div className="shopping-lists-list h-full space-y-2 px-2 overflow-y-auto scrollbar-gutter-stable pb-[env(safe-area-inset-bottom)]">
      {shoppingLists.map((el) => (
        <Card key={el} onClick={() => alert(`Kliknieta liste zakupów nr ${el}`)}>
          <CardHeader>
            <CardTitle>Lista bez nazwy {el}</CardTitle>
            <CardDescription>2/10 | 20%</CardDescription>
            <CardAction className="row-span-full! flex items-center justify-center h-full">
              {">"}
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function EmptyListPrompt() {
  return (
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
  );
}
