import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Clock, Globe, Lock, Save, Send, Plus, Trash2 } from "lucide-react";

export function RecipeEditorScreen() {
  const navigate = useNavigate();

  // Podstawowe informacje
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeToMake, setTimeToMake] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [imagePreview] = useState<string | null>(null);

  // Bezpieczna inicjalizacja stanu bez błędu "impure function"
  const [ingredients, setIngredients] = useState(() => [
    { id: Date.now().toString() + Math.random().toString(), name: "", quantity: "", unit: "" },
  ]);

  const [steps, setSteps] = useState(() => [
    { id: Date.now().toString() + Math.random().toString(), title: "", description: "" },
  ]);

  // --- FUNKCJE DLA SKŁADNIKÓW ---
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString() + Math.random().toString(), name: "", quantity: "", unit: "" },
    ]);
  };

  const updateIngredient = (id: string, field: string, value: string) => {
    setIngredients(ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)));
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  // --- FUNKCJE DLA KROKÓW ---
  const addStep = () => {
    setSteps([...steps, { id: Math.random().toString(36.2), title: "", description: "" }]);
  };

  const updateStep = (id: string, field: string, value: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)));
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  // --- BEZPIECZNY POWRÓT ---
  const handleBack = () => {
    if (name.trim() !== "" || ingredients[0].name !== "") {
      const confirmLeave = window.confirm("Masz niezapisane zmiany. Czy na pewno chcesz wyjść?");
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* 1. Górny pasek nawigacji */}
      <div className="flex items-center justify-between p-4 border-b border-border/40 shrink-0 bg-background">
        <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2">
          <ArrowLeft size={22} />
        </Button>
        <h1 className="font-semibold text-lg">Edytor przepisu</h1>
        <div className="w-10" />
      </div>

      {/* 2. Główny kontener z formularzem (przewijany) */}
      <div className="flex-1 flex flex-col px-4 pt-4 pb-28 gap-6 overflow-y-auto">
        {/* --- SEKCJA: PODSTAWY --- */}
        <div className="flex flex-col gap-4">
          {/* Zdjęcie */}
          <div className="w-full aspect-video bg-secondary/30 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 overflow-hidden relative cursor-pointer hover:bg-secondary/50 transition-colors">
            {imagePreview ? (
              <img src={imagePreview} alt="Podgląd" className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="bg-background p-3 rounded-full shadow-sm border border-border/50">
                  <Camera className="text-muted-foreground" size={24} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Dodaj zdjęcie potrawy
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80 pl-1">Nazwa przepisu</label>
            <input
              type="text"
              placeholder="np. Spaghetti Bolognese"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary/20 border border-border/50 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80 pl-1">Krótki opis</label>
            <textarea
              placeholder="Napisz coś o tym przepisie..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-secondary/20 border border-border/50 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80 pl-1">
              Czas przygotowania (min)
            </label>
            <div className="relative">
              <Clock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="number"
                placeholder="np. 45"
                value={timeToMake}
                onChange={(e) => setTimeToMake(e.target.value)}
                className="w-full bg-secondary/20 border border-border/50 rounded-lg pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <hr className="border-border/50" />

        {/* --- SEKCJA: SKŁADNIKI --- */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg">Składniki</h2>

          <div className="flex flex-col gap-2">
            {ingredients.map((ing) => (
              <div key={ing.id} className="flex items-center gap-2 bg-orange-400">
                <input
                  type="text"
                  placeholder="Nazwa (np. Mleko)"
                  value={ing.name}
                  onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                  className="flex-1 bg-secondary/20 border border-border/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <input
                  type="number"
                  placeholder="Ilość"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(ing.id, "quantity", e.target.value)}
                  className="w-15 bg-secondary/20 border border-border/50 rounded-lg px-2 py-2.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <input
                  type="text"
                  placeholder="Jedn."
                  value={ing.unit}
                  onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                  className="w-15 bg-secondary/20 border border-border/50 rounded-lg px-2 py-2.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ing.id)}
                  disabled={ingredients.length === 1}
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10 shrink-0"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 border-dashed border-2 mt-1"
            onClick={addIngredient}
          >
            <Plus size={16} /> Dodaj kolejny składnik
          </Button>
        </div>

        <hr className="border-border/50" />

        {/* --- SEKCJA: KROKI --- */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg">Kroki przygotowania</h2>

          <div className="flex flex-col gap-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col gap-2 p-3 bg-secondary/10 border border-border/50 rounded-xl relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/50">
                    Krok {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(step.id)}
                    disabled={steps.length === 1}
                    className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <input
                  type="text"
                  placeholder="Tytuł kroku (opcjonalnie)"
                  value={step.title}
                  onChange={(e) => updateStep(step.id, "title", e.target.value)}
                  className="w-full bg-secondary/20 border border-border/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 font-medium"
                />
                <textarea
                  placeholder="Opisz, co należy zrobić..."
                  value={step.description}
                  onChange={(e) => updateStep(step.id, "description", e.target.value)}
                  rows={5}
                  className="w-full bg-secondary/20 border border-border/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                />
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 border-dashed border-2 mt-1"
            onClick={addStep}
          >
            <Plus size={16} /> Dodaj kolejny krok
          </Button>
        </div>

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

      {/* 3. Dolny pasek akcji */}
      <div className="absolute bottom-0 left-0 w-full bg-red-500 border-t border-border/50 p-4 flex gap-3 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button
          variant="secondary"
          className="flex-1 h-12 flex items-center gap-2"
          onClick={() =>
            console.log("Zapisuję jako szkic:", {
              name,
              description,
              timeToMake,
              isGlobal,
              ingredients,
              steps,
            })
          }
        >
          <Save size={18} /> Zapisz szkic
        </Button>
        <Button
          className="flex-1 h-12 flex items-center gap-2 bg-primary text-primary-foreground"
          onClick={() => console.log("Publikuję przepis...")}
        >
          <Send size={18} /> Opublikuj
        </Button>
      </div>
    </div>
  );
}
