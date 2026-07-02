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
  const [shoppingListsData, setShoppingListsData] = useState([
    {
      id: 162765436543,
      name: "Pierwsza lista",
      createdAt: "02.07.2026",
      itemsIn: 4,
      completedCount: 1,
    },
    {
      id: 162765436544,
      name: "Obiad niedziela",
      createdAt: "02.07.2026",
      itemsIn: 6,
      completedCount: 2,
    },
    {
      id: 162765436545,
      name: "Zupa Meksykańska",
      createdAt: "02.07.2026",
      itemsIn: 10,
      completedCount: 0,
    },
  ]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <ShoppingListsNavbar inputVal={searchInput} setInputVal={setSearchInput} />
      <ShoppingListsList
        shoppingLists={shoppingListsData.filter((list) =>
          list.name.toUpperCase().includes(searchInput.toUpperCase()),
        )}
        isSearchOn={searchInput.length > 0}
      />
    </div>
  );
}
