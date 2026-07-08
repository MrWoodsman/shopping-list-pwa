import { ChefHat } from "lucide-react";

export function RecipesScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center pt-[max(16px,env(safe-area-inset-top))] bg-background">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="relative p-5 bg-primary/10 rounded-full border border-primary/20">
          <ChefHat className="size-12 text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-3">Przepisy</h1>

      <p className="text-sm text-muted-foreground max-w-70 leading-relaxed">
        Moduł kulinarny jest w budowie. Wkrótce będziesz mógł dodawać tu swoje ulubione dania i
        jednym kliknięciem wrzucać wszystkie składniki na listę zakupów!
      </p>

      <div className="mt-8 px-4 py-1.5 bg-secondary/50 text-secondary-foreground text-xs font-semibold rounded-full uppercase tracking-widest border border-border">
        Wkrótce
      </div>
    </div>
  );
}
