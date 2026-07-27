import { useAllRecipesQuery } from "@/hooks/useRecipes";
import { Globe, PenBox, Clock, Lock, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { RecipeItem } from "@shared/types";

export function RecipesDraftsScreen() {
  const { data, isLoading, error } = useAllRecipesQuery();
  const [searchVal, setSearchVal] = useState("");

  if (isLoading) return <div className="p-4 text-neutral-500">Ładowanie szkiców...</div>;
  if (error) return <div className="p-4 text-red-500">Nie udało się załadować szkiców!</div>;

  // Filtrujemy tylko szkice i aplikujemy wyszukiwarkę
  const drafts = data?.filter((item) => item.status === "draft") || [];
  const filteredDrafts = drafts.filter((item) =>
    item.name.toUpperCase().includes(searchVal.toUpperCase()),
  );

  return (
    <div className="w-full h-full flex flex-col gap-1 bg-background pt-2">
      {/* 1. Dedykowany, lekki pasek wyszukiwania (zamiast ciężkiego Navbara) */}
      <div className="px-4 pb-2 shrink-0">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Szukaj w szkicach..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-secondary/50 border border-border/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* 2. Przewijany kontener z listą (teraz z banerem w środku!) */}
      <div className="content flex flex-col px-2 pb-4 gap-3 overflow-y-auto">
        {/* BANER INFORMACYJNY - przewija się razem z listą */}
        <div className="mx-1 mt-1 mb-2 p-3.5 bg-secondary/30 border border-secondary/50 rounded-xl flex items-start gap-3.5 shadow-sm shrink-0">
          <div className="bg-secondary/60 p-2.5 rounded-lg shrink-0 mt-0.5">
            <PenBox size={20} className="text-foreground/80" />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between items-center w-full">
              <h1 className="font-semibold text-lg leading-none tracking-tight">Szkice</h1>
              <span className="text-[11px] font-bold bg-background text-muted-foreground px-2 py-0.5 rounded-full border border-border/50 shadow-sm">
                {drafts.length}
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed pr-2">
              Przepisy czekające na dokończenie. Edytuj je, aby trafiły na główną listę.
            </p>
          </div>
        </div>

        {/* LISTA SZKICÓW */}
        {filteredDrafts.length === 0 ? (
          <div className="text-center p-8 text-neutral-500 mt-6">Brak wyników.</div>
        ) : (
          filteredDrafts.map((recipe) => <RecipeItem key={recipe.id} recipe={recipe} />)
        )}
      </div>
    </div>
  );
}

function RecipeItem({ recipe }: { recipe: RecipeItem }) {
  return (
    <div className="relative border-2 border-dashed border-foreground/20 p-3 rounded-lg flex flex-col gap-3 bg-background/50">
      <div className="flex justify-between items-start gap-2">
        <h1 className="text-lg font-semibold leading-tight mt-0.5">
          {recipe.name || "Nienazwany przepis"}
        </h1>

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

      <Button
        variant="outline"
        className="w-full mt-2 gap-2"
        onClick={() => console.log(`Edytuj przepis: ${recipe.id}`)}
      >
        <PenBox size={16} />
        Dokończ edycję
      </Button>
    </div>
  );
}
