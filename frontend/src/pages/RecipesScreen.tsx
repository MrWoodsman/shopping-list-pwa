import { RecipesListNavbar } from "@/components/recipes/RecipesListNavbar";
import { useAllRecipesQuery } from "@/hooks/useRecipes";
import { Globe } from "lucide-react";

export function RecipesScreen() {
  const { data, isLoading, error } = useAllRecipesQuery();

  if (isLoading) return <div className="p-4 text-neutral-500">Ładowanie przepisów...</div>;
  if (error) return <div className="p-4 text-red-500">Nie udało się załadować przepisów!</div>;

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <RecipesListNavbar inputVal="1" setInputVal={() => {}} />
      <div className="content flex flex-col px-2 pb-2 gap-2 overflow-y-auto">
        {data?.map((recipe) => (
          <div
            key={recipe.id}
            className="relative border border-foreground/20 p-2 rounded-lg space-y-2"
          >
            <h1 className="text-md font-semibold">{recipe.name}</h1>
            <div className="lane-wrap flex justify-between">
              <h2 className="text-sm font-normal text-foreground/75">{recipe.description}</h2>
              <h2 className="text-sm font-normal">{recipe.time_to_make}min</h2>
            </div>
            <div className="w-full aspect-video bg-foreground/25 flex items-center justify-center rounded-sm">
              <img
                src={`${recipe.image_url}`}
                alt={`Zdjecie przedstawiajace ${recipe.name}`}
                className="rounded-sm"
              />
            </div>
            {recipe.is_global ? (
              <div className="global-badge absolute top-0 right-3 bg-blue-500 border-t-0 border border-blue-600/50 p-1 rounded-b-lg z-10">
                <Globe className="text-white" size={20} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
