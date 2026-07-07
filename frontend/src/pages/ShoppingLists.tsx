import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// COMPONENTS
import { ShoppingListsList } from "@/components/shopping-lists/ShoppingListsList";
import { ShoppingListsNavbar } from "@/components/shopping-lists/ShoppingListsNavbar";
// TYPES
import { type ShoppingListData } from "@shared/types";
import { fetchWithGroup } from "@/utils/api";

export function ShoppingLists() {
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error } = useQuery<ShoppingListData[]>({
    queryKey: ["shoppingLists"],
    queryFn: async () => {
      const response = await fetchWithGroup("/api/shopping-lists");
      if (!response.ok) throw new Error("Błąd pobierania");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (error) return <div>Wystąpił błąd: {error.message}</div>;

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <ShoppingListsNavbar inputVal={searchInput} setInputVal={setSearchInput} />
      <ShoppingListsList
        isLoading={isLoading}
        shoppingLists={
          data?.filter((list) => list.name.toUpperCase().includes(searchInput.toUpperCase())) ?? []
        }
        searchInput={searchInput}
      />
    </div>
  );
}
