export interface ShoppingListData {
  id: string;
  name: string;
  createdAt: string;
  itemsIn: number;
  completedCount: number;
  items: ShoppingItem[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  completed: boolean;
}

export interface AggregateShoppingItem extends ShoppingItem {
  list_id: string;
  list_name?: string;
}
