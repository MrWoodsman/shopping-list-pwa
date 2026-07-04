export interface ShoppingListData {
  id: number;
  name: string;
  createdAt: string;
  itemsIn: number;
  completedCount: number;
  items: ShoppingItem[];
}

export interface ShoppingItem {
  id: number;
  name: string;
  completed: boolean;
}
