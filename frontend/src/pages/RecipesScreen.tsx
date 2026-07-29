import { RecipesListNavbar } from "@/components/recipes/RecipesListNavbar";
import { ROUTES } from "@/config/routes";
import { useAllRecipesQuery } from "@/hooks/useRecipes";
import { Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RecipesScreen() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAllRecipesQuery();
  const [searchVal, setSearchVal] = useState("");

  // Zoptymalizowane filtrowanie (robimy to tylko raz)
  const published = data?.filter((item) => item.status === "published") || [];
  const displayedRecipes = published.filter((item) =>
    item.name.toUpperCase().includes(searchVal.toUpperCase()),
  );

  if (isLoading) return <div className="p-4 text-neutral-500">Ładowanie przepisów...</div>;
  if (error) return <div className="p-4 text-red-500">Nie udało się załadować przepisów!</div>;

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <RecipesListNavbar inputVal={searchVal} setInputVal={setSearchVal} />

      {/* DODANO flex-1 TUTAJ, żeby kontener zajął całą resztę ekranu po navbarze */}
      <div className="content flex-1 flex flex-col px-2 pb-2 gap-2 overflow-y-auto">
        {/* SPRAWDZAMY CZY SĄ JAKIEŚ WYNIKI */}
        {displayedRecipes.length > 0 ? (
          displayedRecipes.map((recipe) => (
            <div
              onClick={() => navigate(ROUTES.RECIPES_VIEW(recipe.id))}
              key={recipe.id}
              className="relative border border-foreground/20 p-2 rounded-lg flex flex-col gap-2 cursor-pointer hover:bg-secondary/10 transition-colors shrink-0"
            >
              <h1 className="text-md font-semibold">{recipe.name}</h1>
              <div className="lane-wrap flex justify-between">
                <h2 className="text-sm font-normal text-foreground/75">{recipe.description}</h2>
                <h2 className="text-sm font-normal">{recipe.time_to_make}min</h2>
              </div>
              <div className="w-full aspect-video bg-foreground/10 flex items-center justify-center rounded-sm overflow-hidden">
                <img
                  src={`${recipe.image_url}`}
                  alt={`Zdjęcie przedstawiające ${recipe.name}`}
                  className="rounded-sm w-full h-full object-cover aspect-video"
                />
              </div>
              {recipe.is_global ? (
                <div className="global-badge absolute top-0 right-3 bg-blue-500 border-t-0 border border-blue-600/50 p-1 rounded-b-lg z-10 shadow-sm">
                  <Globe className="text-white" size={18} />
                </div>
              ) : null}
            </div>
          ))
        ) : (
          /* TERAZ KOMUNIKAT BĘDZIE NA SAMYM ŚRODKU */
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground p-4 min-h-[50vh]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-20 mb-2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p className="text-lg font-medium">Nie znaleziono przepisów</p>
            <p className="text-sm">Spróbuj wpisać inną nazwę w wyszukiwarce.</p>
          </div>
        )}
      </div>
    </div>
  );
}
