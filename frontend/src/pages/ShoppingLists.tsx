import { ShoppingListsList } from "@/components/shopping-lists/ShoppingListsList";
import { ShoppingListsNavbar } from "@/components/shopping-lists/ShoppingListsNavbar";

export function ShoppingLists() {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <ShoppingListsNavbar />
      <ShoppingListsList />
    </div>
  );
}
