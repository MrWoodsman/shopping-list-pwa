import { RecipesListNavbar } from "@/components/recipes/RecipesListNavbar";
import { ROUTES } from "@/config/routes";
import { useAllRecipesQuery } from "@/hooks/useRecipes";
import type { RecipeItem } from "@shared/types";
import { Edit, Globe, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// NEW
import { MoreVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { useGroup } from "@/hooks/useGroup";
import { ConfirmModal } from "@/components/overlay/ConfirmModal";
import { useDeleteRecipeMutation } from "@/hooks/useRecipeMutations";

export function RecipesScreen() {
  // STAN MODALA
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeItem | null>(null);
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipeMutation();

  const { data, isLoading, error } = useAllRecipesQuery();
  const [searchVal, setSearchVal] = useState("");

  const published = data?.filter((item) => item.status === "published") || [];
  const displayedRecipes = published.filter((item) =>
    item.name.toUpperCase().includes(searchVal.toUpperCase()),
  );

  if (isLoading) return <div className="p-4 text-neutral-500">Ładowanie przepisów...</div>;
  if (error) return <div className="p-4 text-red-500">Nie udało się załadować przepisów!</div>;

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <RecipesListNavbar inputVal={searchVal} setInputVal={setSearchVal} />

        <div className="content flex-1 flex flex-col px-2 pb-2 gap-2 overflow-y-auto">
          {displayedRecipes.length > 0 ? (
            displayedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} setRecipeToDelete={setRecipeToDelete} />
            ))
          ) : (
            <RecipesNoFound />
          )}
        </div>
      </div>
      {/* MODAL POTWIERDZENIA USUNIĘCIA */}
      <ConfirmModal
        isOpen={!!recipeToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setRecipeToDelete(null);
        }}
        title="Usuwanie przepisu"
        description={`Czy na pewno chcesz usunąć przepis "${recipeToDelete?.name}"? Tej operacji nie można cofnąć.`}
        confirmText={isDeleting ? "Usuwanie..." : "Usuń przepis"}
        confirmVariant="destructive"
        onConfirm={() => {
          if (!recipeToDelete) return;

          deleteRecipe(recipeToDelete.id, {
            onSuccess: () => {
              setRecipeToDelete(null);
            },
          });
        }}
      />
    </>
  );
}

function RecipeCard({
  recipe,
  setRecipeToDelete,
}: {
  recipe: RecipeItem;
  setRecipeToDelete: (recipe: RecipeItem) => void;
}) {
  const { groupId } = useGroup();
  const navigate = useNavigate();

  return (
    <Card
      key={recipe.id}
      onClick={() => navigate(ROUTES.RECIPES_VIEW(recipe.id))}
      className="group relative flex flex-col overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/30 pt-0 pb-0"
    >
      {/* SEKCJA ZDJĘCIA (Przeniesiona na górę dla lepszego efektu) */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={recipe.image_url || ""}
          alt={`Zdjęcie przedstawiające ${recipe.name}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Global Badge nałożony ładnie na zdjęcie */}
        {recipe.is_global && (
          <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
            <Globe className="text-white" size={14} />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              Global
            </span>
          </div>
        )}
      </div>

      {/* SEKCJA TEKSTU I AKCJI */}
      <CardContent className="p-4 pt-0 flex flex-col grow gap-2">
        {/* Nagłówek: Tytuł + Przycisk opcji */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{recipe.name}</h3>

          {/* Menu 3 kropki (Dropdown) */}
          {/* UWAGA: e.stopPropagation() jest tu kluczowe, żeby kliknięcie w kropki nie przeniosło nas do przepisu! */}
          <div onClick={(e) => e.stopPropagation()} className="-mt-1 -mr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {recipe.group_id == groupId && (
                  <>
                    <DropdownMenuItem
                      onClick={() => navigate(`${ROUTES.RECIPES_EDITOR}?id=${recipe.id}`)}
                    >
                      <Edit size={16} />
                      Edytuj przepis
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecipeToDelete(recipe);
                      }}
                      className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    >
                      <Trash2 size={16} />
                      Usuń przepis
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => console.log("Dodawnie składników do listy")}>
                  <ShoppingCart size={16} />
                  Dodaj składniki do listy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Opis */}
        <p className="text-sm text-muted-foreground line-clamp-2 grow">{recipe.description}</p>

        {/* Czas przygotowania */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 mt-1">
          <Clock size={16} className="text-muted-foreground" />
          <span>{recipe.time_to_make} min</span>
        </div>
      </CardContent>
    </Card>
  );
}

function RecipesNoFound() {
  return (
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
  );
}
