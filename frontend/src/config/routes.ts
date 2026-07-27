export const ROUTES = {
  HOME: "/",
  SHOPPING_LISTS: "/shopping",
  SHOPPING_ALL: "/shopping/all",
  AUTO_LIST: "/auto-list",
  RECIPES: "/recipes",
  RECIPES_DRAFTS: "/recipes/drafts",
  SETTINGS: "/settings",

  // SCIEZKI DYNAMICZNE
  LIST_DETAIL: (id: string) => `/shopping/${id}`,
} as const;
