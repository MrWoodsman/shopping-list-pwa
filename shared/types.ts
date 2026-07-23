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

// PRZEPISY
export interface RecipeItem {
  id: string;
  name: string;
  description: string;
  image_url: string;
  time_to_make: number;
  is_global: boolean | number;
  created_at?: string;
  last_update?: string;
  group_id?: string;
}
