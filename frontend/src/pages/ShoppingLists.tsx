import { ShoppingListsList } from "@/components/shopping-lists/ShoppingListsList";
import { ShoppingListsNavbar } from "@/components/shopping-lists/ShoppingListsNavbar";
import { useState } from "react";

export interface ShoppingListData {
  id: number;
  name: string;
  createdAt: string;
  itemsIn: number;
  completedCount: number;
}

export function ShoppingLists() {
  const [searchInput, setSearchInput] = useState("");
  // setShoppingListsData
  const [shoppingListsData] = useState([]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <ShoppingListsNavbar inputVal={searchInput} setInputVal={setSearchInput} />
      <ShoppingListsList
        shoppingLists={shoppingListsData.filter((list) =>
          list.name.toUpperCase().includes(searchInput.toUpperCase()),
        )}
        searchInput={searchInput}
      />
    </div>
  );
}
