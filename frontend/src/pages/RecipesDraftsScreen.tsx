import { RecipesListNavbar } from "@/components/recipes/RecipesListNavbar";
import { useAllRecipesQuery } from "@/hooks/useRecipes";
import { Globe, PenBox, Clock, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RecipesDraftsScreen() {
  const { data, isLoading, error } = useAllRecipesQuery();
  const [searchVal, setSearchVal] = useState("");

  console.log(data);

  if (isLoading) return <div className="p-4 text-neutral-500">Ładowanie szkiców...</div>;
  if (error) return <div className="p-4 text-red-500">Nie udało się załadować szkiców!</div>;

  // Filtrujemy tylko szkice i aplikujemy wyszukiwarkę
  const drafts = data?.filter((item) => item.status === "draft") || [];
  const filteredDrafts = drafts.filter((item) =>
    item.name.toUpperCase().includes(searchVal.toUpperCase()),
  );

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <RecipesListNavbar inputVal={searchVal} setInputVal={setSearchVal} />

      {/* Bardziej opisowy nagłówek */}
      <div className="px-4 py-2">
        <h1 className="font-semibold text-2xl">Szkice</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Przepisy, które zacząłeś pisać, ale czekają na dokończenie.
        </p>
      </div>

      <div className="content flex flex-col px-2 pb-2 gap-3 overflow-y-auto">
        {filteredDrafts.length === 0 ? (
          <div className="text-center p-8 text-neutral-500 mt-10">
            Nie masz żadnych niedokończonych przepisów.
          </div>
        ) : (
          filteredDrafts.map((recipe) => (
            <div
              key={recipe.id}
              // Przerywana ramka (border-dashed) i lekko wygaszone tło
              className="relative border-2 border-dashed border-foreground/20 p-3 rounded-lg flex flex-col gap-3 bg-background/50"
            >
              {/* Uporządkowany nagłówek z poprawnym ułożeniem plakietek */}
              <div className="flex justify-between items-start gap-2">
                <h1 className="text-lg font-semibold leading-tight mt-0.5">
                  {recipe.name || "Nienazwany przepis"}
                </h1>

                {/* Grupa prawych plakietek - idealnie równe pudełka */}
                <div className="flex items-center gap-1 shrink-0">
                  {recipe.is_global ? (
                    <div className="bg-blue-500 h-6 w-6 flex items-center justify-center rounded-md">
                      <Globe className="text-white" size={14} />
                    </div>
                  ) : (
                    <div className="bg-neutral-600 h-6 w-6 flex items-center justify-center rounded-md">
                      <Lock className="text-white" size={14} />
                    </div>
                  )}

                  <div className="bg-secondary text-secondary-foreground h-6 px-2 flex items-center justify-center text-[10px] uppercase font-bold rounded-md tracking-wider">
                    Szkic
                  </div>
                </div>
              </div>

              {/* Obsługa brakujących danych */}
              <div className="flex flex-col gap-1">
                <h2 className="text-sm text-foreground/75">
                  {recipe.description ? (
                    recipe.description
                  ) : (
                    <span className="italic text-foreground/40">Brak opisu...</span>
                  )}
                </h2>

                {recipe.time_to_make > 0 ? (
                  <h2 className="text-xs font-medium flex items-center gap-1 text-foreground/60 mt-1">
                    <Clock size={14} /> {recipe.time_to_make} min
                  </h2>
                ) : (
                  <span className="italic text-foreground/40 flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    Brak podanego czasu...
                  </span>
                )}
              </div>

              {/* Obsługa braku zdjęcia w szkicu */}
              {recipe.image_url ? (
                <div className="w-full aspect-video bg-foreground/10 flex items-center justify-center rounded-md overflow-hidden">
                  <img
                    src={`${recipe.image_url}`}
                    alt={`Szkic: ${recipe.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-20 bg-foreground/5 rounded-md flex items-center justify-center text-foreground/40 text-sm border border-foreground/10">
                  Zdjęcie nie zostało jeszcze dodane
                </div>
              )}

              {/* Wyraźny przycisk Call to Action na samym dole */}
              <Button
                variant="outline"
                className="w-full mt-2 gap-2"
                onClick={() => console.log(`Edytuj przepis: ${recipe.id}`)}
              >
                <PenBox size={16} />
                Dokończ edycję
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
