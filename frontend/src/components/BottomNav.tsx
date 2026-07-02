import { ListChecks, ChefHat, Settings, Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();

  // Funkcja pomocnicza, która sprawdza czy ścieżka jest aktywna
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-t bg-background pt-3 pb-[max(8px,env(safe-area-inset-bottom))] px-4">
      <div className="flex justify-around items-center">
        <Link to="/shopping-lists" className="w-full flex flex-col items-center -space-y-1.5">
          <ListChecks
            className={`size-6 ${isActive("/shopping-lists") || isActive("/shopping") ? "text-primary" : "text-neutral-400"}`}
          />
          <span
            className={`text-[10px] ${isActive("/shopping-lists") || isActive("/shopping") ? "text-primary font-medium" : "text-neutral-400"}`}
          >
            Listy
          </span>
        </Link>

        <Link to="/auto-list" className="w-full flex flex-col items-center -space-y-1.5">
          <Bot
            className={`size-6 ${isActive("/auto-lista") ? "text-primary" : "text-neutral-400"}`}
          />
          <span
            className={`text-[10px] ${isActive("/auto-list") ? "text-primary font-medium" : "text-neutral-400"}`}
          >
            Uzupełnianie
          </span>
        </Link>

        <Link to="/recipes" className="w-full flex flex-col items-center -space-y-1.5">
          <ChefHat
            className={`size-6 ${isActive("/recipes") ? "text-primary" : "text-neutral-400"}`}
          />
          <span
            className={`text-[10px] ${isActive("/recipes") ? "text-primary font-medium" : "text-neutral-400"}`}
          >
            Przepisy
          </span>
        </Link>

        <Link to="/settings" className="w-full flex flex-col items-center -space-y-1.5">
          <Settings
            className={`size-6 ${isActive("/settings") ? "text-primary" : "text-neutral-400"}`}
          />
          <span
            className={`text-[10px] ${isActive("/settings") ? "text-primary font-medium" : "text-neutral-400"}`}
          >
            Ustawienia
          </span>
        </Link>
      </div>
    </nav>
  );
}
