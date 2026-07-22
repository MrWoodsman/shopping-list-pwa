import { useState } from "react";
// COMPONENTS
import { ShoppingListsList } from "@/components/shopping-lists/ShoppingListsList";
import { ShoppingListsNavbar } from "@/components/shopping-lists/ShoppingListsNavbar";
// TYPES
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllShoppingListsQuery } from "@/hooks/useLists";

export function ShoppingListsScreen() {
  const { data, isLoading, error } = useAllShoppingListsQuery();
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <ShoppingListsNavbar inputVal={searchInput} setInputVal={setSearchInput} />
      {error ? (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
          <div className="p-4 bg-destructive/20 rounded-full text-destructive">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-semibold">Coś poszło nie tak</h3>
          <p className="text-sm text-neutral-400">
            Sprawdź połączenie z serwerem i spróbuj ponownie.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Odśwież
          </Button>
        </div>
      ) : (
        <ShoppingListsList
          isLoading={isLoading}
          shoppingLists={
            data?.filter((list) => list.name.toUpperCase().includes(searchInput.toUpperCase())) ??
            []
          }
          searchInput={searchInput}
        />
      )}
    </div>
  );
}
