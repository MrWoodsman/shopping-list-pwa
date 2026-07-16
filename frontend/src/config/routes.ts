export const ROUTES = {
  HOME: "/",
  SHOPPING_LISTS: "/shopping",
  SHOPPING_ALL: "/shopping/all",
  AUTO_LIST: "/auto-list",
  RECIPES: "/recipes",
  SETTINGS: "/settings",

  // SCIEZKI DYNAMICZNE
  LIST_DETAIL: (id: string) => `/shopping/${id}`,
} as const;
