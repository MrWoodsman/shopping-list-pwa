import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

export function AppLayout() {
  return (
    <div className="flex flex-col h-dvh">
      {/* Tu ładuje się Twoja strona (Lista, Ustawienia itp.) */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Navbar na samym dole, zawsze widoczny */}
      <BottomNav />
    </div>
  );
}
