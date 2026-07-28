import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Lock, Save, Send } from "lucide-react";
import type { RecipeItem } from "@shared/types";

// --- IMPORTY SUB-KOMPONENTÓW ---
import { RecipeBasicInfo } from "@/components/recipe-editor/RecipeBasicInfo";
import { RecipeIngredientsForm } from "@/components/recipe-editor/RecipeIngredientsForm";
import { RecipeStepsForm } from "@/components/recipe-editor/RecipeStepsForm";
import { ConfirmModal } from "@/components/overlay/ConfirmModal";

// --- HOOKI API ---
import { useCreateRecipeMutation, useUpdateRecipeMutation } from "@/hooks/useRecipeMutations";
import { useRecipeDetailsQuery } from "@/hooks/useRecipes";

export function RecipeEditorScreen() {
  const navigate = useNavigate();

  // 1. SPRAWDZAMY CZY JESTEŚMY W TRYBIE EDYCJI
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get("id");
  const isEditing = Boolean(recipeId);

  // 2. POBIERANIE DANYCH I MUTACJE
  const { data: existingRecipe, isLoading: isLoadingRecipe } = useRecipeDetailsQuery(recipeId);

  const { mutate: createRecipe, isPending: isCreating } = useCreateRecipeMutation();
  const { mutate: updateRecipe, isPending: isUpdating } = useUpdateRecipeMutation();

  const isPending = isCreating || isUpdating;

  // 3. STANY FORMULARZA
  const [name, setName] = useState(() => existingRecipe?.name || "");
  const [description, setDescription] = useState(() => existingRecipe?.description || "");
  const [timeToMake, setTimeToMake] = useState(
    () => existingRecipe?.time_to_make?.toString() || "",
  );
  const [isGlobal, setIsGlobal] = useState(
    () => existingRecipe?.is_global === 1 || existingRecipe?.is_global === true,
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    () => existingRecipe?.image_url || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [ingredients, setIngredients] = useState(() => {
    const recipe = existingRecipe as RecipeItem;
    if (recipe?.ingredients && recipe.ingredients.length > 0) {
      return recipe.ingredients.map((ing) => ({
        id: ing.id ? ing.id.toString() : Date.now().toString() + Math.random().toString(),
        name: ing.name || "",
        quantity: ing.quantity?.toString() || "",
        unit: ing.unit || "",
      }));
    }
    return [
      { id: Date.now().toString() + Math.random().toString(), name: "", quantity: "", unit: "" },
    ];
  });

  const [steps, setSteps] = useState(() => {
    const recipe = existingRecipe as RecipeItem;
    if (recipe?.steps && recipe.steps.length > 0) {
      return recipe.steps.map((step) => ({
        id: step.id ? step.id.toString() : Date.now().toString() + Math.random().toString(),
        title: step.title || "",
        description: step.description || "",
      }));
    }
    return [{ id: Date.now().toString() + Math.random().toString(), title: "", description: "" }];
  });

  // LOGIKA SKŁADNIKÓW I KROKÓW
  const addIngredient = () =>
    setIngredients([
      ...ingredients,
      { id: Date.now().toString() + Math.random().toString(), name: "", quantity: "", unit: "" },
    ]);
  const updateIngredient = (id: string, field: string, value: string) =>
    setIngredients(ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)));
  const removeIngredient = (id: string) =>
    ingredients.length > 1 && setIngredients(ingredients.filter((ing) => ing.id !== id));

  const addStep = () =>
    setSteps([
      ...steps,
      { id: Date.now().toString() + Math.random().toString(), title: "", description: "" },
    ]);
  const updateStep = (id: string, field: string, value: string) =>
    setSteps(steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)));
  const removeStep = (id: string) =>
    steps.length > 1 && setSteps(steps.filter((step) => step.id !== id));

  // BEZPIECZEŃSTWO I GESTY
  const hasUnsavedChanges = name.trim() !== "" || ingredients[0].name.trim() !== "";
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowExitDialog(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hasUnsavedChanges]);

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      navigate(-1);
    }
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    navigate(-2);
  };

  // 5. WYSYŁKA DO BACKENDU (Tworzenie vs Aktualizacja)
  const handleSave = (status: "published" | "draft") => {
    if (!name.trim()) {
      alert("Nazwa przepisu jest wymagana!");
      return;
    }

    const finalIngredients = ingredients
      .filter((ing) => ing.name.trim() !== "")
      .map((ing) => ({
        name: ing.name.trim(),
        quantity: Number(ing.quantity) || 0,
        unit: ing.unit,
      }));

    const finalSteps = steps
      .filter((step) => step.description.trim() !== "")
      .map((step, index) => ({
        order: index + 1,
        title: step.title.trim(),
        description: step.description.trim(),
      }));

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("time_to_make", timeToMake.toString());
    formData.append("is_global", isGlobal ? "true" : "false");
    formData.append("status", status);
    formData.append("ingredients", JSON.stringify(finalIngredients));
    formData.append("steps", JSON.stringify(finalSteps));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (isEditing && recipeId) {
      // AKTUALIZACJA (PUT)
      updateRecipe(
        { id: recipeId, formData },
        {
          onSuccess: () => navigate("/recipes", { replace: true }),
        },
      );
    } else {
      // TWORZENIE (POST)
      createRecipe(formData, {
        onSuccess: () => navigate("/recipes", { replace: true }),
      });
    }
  };

  // Ekran ładowania na czas pobierania danych z bazy w trybie edycji
  if (isEditing && isLoadingRecipe) {
    return (
      <div className="w-full h-dvh flex items-center justify-center text-muted-foreground">
        Pobieranie przepisu...
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-dvh flex flex-col bg-background overflow-hidden relative">
        {/* Górny Pasek */}
        <div className="flex items-center justify-between p-4 border-b border-border/40 shrink-0 bg-background pt-[max(12px,env(safe-area-inset-top))]">
          <Button variant="ghost" size="icon" onClick={handleBackClick} className="-ml-2">
            <ArrowLeft size={22} />
          </Button>
          <h1 className="font-semibold text-lg">{isEditing ? "Edytuj przepis" : "Nowy przepis"}</h1>
          <div className="w-10" />
        </div>

        {/* Zawartość formularza */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-4 pt-4 pb-6">
          <RecipeBasicInfo
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            timeToMake={timeToMake}
            setTimeToMake={setTimeToMake}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
          />

          <hr className="border-border/50" />

          <RecipeIngredientsForm
            ingredients={ingredients}
            addIngredient={addIngredient}
            updateIngredient={updateIngredient}
            removeIngredient={removeIngredient}
          />

          <hr className="border-border/50" />

          <RecipeStepsForm
            steps={steps}
            addStep={addStep}
            updateStep={updateStep}
            removeStep={removeStep}
          />

          {/* Widoczność */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-medium text-foreground/80 pl-1">Widoczność</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsGlobal(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${!isGlobal ? "bg-neutral-600 border-neutral-500 text-white shadow-sm" : "bg-secondary/20 border-border/50 text-muted-foreground"}`}
              >
                <Lock size={16} /> Tylko dla mnie
              </button>
              <button
                onClick={() => setIsGlobal(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${isGlobal ? "bg-blue-500 border-blue-400 text-white shadow-sm" : "bg-secondary/20 border-border/50 text-muted-foreground"}`}
              >
                <Globe size={16} /> Globalny
              </button>
            </div>
          </div>
        </div>

        {/* Dolny pasek akcji */}
        <div className="shrink-0 border-t border-border/50 bg-background p-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-md">
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 h-12 flex items-center gap-2"
              onClick={() => handleSave("draft")}
              disabled={isPending}
            >
              <Save size={18} /> Zapisz szkic
            </Button>
            <Button
              className="flex-1 h-12 flex items-center gap-2 bg-primary text-primary-foreground"
              onClick={() => handleSave("published")}
              disabled={isPending}
            >
              <Send size={18} /> {isPending ? "Zapisywanie..." : "Opublikuj"}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={confirmExit}
        title="Niezapisane zmiany"
        description="Masz niezapisane zmiany w przepisie. Czy na pewno chcesz wyjść bez zapisywania? Cała Twoja praca przepadnie."
        cancelText="Wróć do edycji"
        confirmText="Tak, wyjdź"
        confirmVariant="destructive"
      />
    </>
  );
}
