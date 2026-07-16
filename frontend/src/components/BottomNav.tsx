import { ListChecks, ChefHat, Settings, Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React from "react";

// Definicja Propsów
interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
  children: React.ReactNode;
}

// Komponent pomocniczy
function BottomNavItem({ to, label, isActive, children }: NavItemProps) {
  return (
    <Link to={to} className="w-full flex flex-col items-center -space-y-1.5">
      <div className={`[&>svg]:size-6 ${isActive ? "text-primary" : "text-neutral-400"}`}>
        {children}
      </div>
      <span className={`text-[10px] ${isActive ? "text-primary font-medium" : "text-neutral-400"}`}>
        {label}
      </span>
    </Link>
  );
}

// Główny komponent
export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="border-t bg-background pt-3 pb-[max(8px,env(safe-area-inset-bottom))] px-4">
      <div className="flex justify-around items-center">
        <BottomNavItem to="/shopping-lists" label="Listy" isActive={path.startsWith("/shopping")}>
          <ListChecks />
        </BottomNavItem>

        <BottomNavItem to="/auto-list" label="Uzupełnianie" isActive={path === "/auto-list"}>
          <Bot />
        </BottomNavItem>

        <BottomNavItem to="/recipes" label="Przepisy" isActive={path === "/recipes"}>
          <ChefHat />
        </BottomNavItem>

        <BottomNavItem to="/settings" label="Ustawienia" isActive={path === "/settings"}>
          <Settings />
        </BottomNavItem>
      </div>
    </nav>
  );
}
