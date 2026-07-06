import { useState } from "react";
// Dodajemy Navigate do importów z routera!
import { Routes, Route, Navigate } from "react-router-dom";
import { useGroup } from "./hooks/useGroup";
import { ShoppingLists } from "./pages/ShoppingLists";
import { HomeScreen } from "./pages/HomeScreen";
import { Onboarding } from "./components/Onboarding";
import { AppLayout } from "./components/AppLayout";
import { ShoppingScreen } from "./pages/ShoppingScreen";
import { SettingsScreen } from "./pages/SettingsScreen";

function App() {
  const { groupId, joinGroup, leaveGroup } = useGroup();

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("has-seen-onboarding");
  });

  const handleCompleteOnboarding = () => {
    localStorage.setItem("has-seen-onboarding", "true");
    setShowOnboarding(false);
  };

  // 1. STRAŻNIK: ONBOARDING
  if (showOnboarding) {
    return (
      <div className="fixed inset-0 z-50 bg-background w-full h-full">
        <Onboarding onComplete={handleCompleteOnboarding} />
      </div>
    );
  }

  // 2. STRAŻNIK: GRUPA (Jeśli nie masz grupy, widzisz tylko ten ekran wpisywania)
  if (!groupId) {
    return <HomeScreen onJoin={joinGroup} />;
  }

  // 3. WSZYSTKO JEST OK (Masz grupę): Ładujemy aplikację
  return (
    <Routes>
      {/* Magiczne przekierowanie - fizycznie zmienia URL i wpycha w AppLayout */}
      <Route path="/" element={<Navigate to="/shopping-lists" replace />} />

      <Route element={<AppLayout />}>
        <Route path="/shopping-lists" element={<ShoppingLists />} />
        <Route path="/shopping/:id" element={<ShoppingScreen />} />
        <Route
          path="/recipes"
          element={
            <div className="p-4 pt-safe pt-[max(16px,env(safe-area-inset-top))]">
              Ekran przepisów (wkrótce)
            </div>
          }
        />
        <Route
          path="/auto-list"
          element={
            <div className="p-4 pt-safe pt-[max(16px,env(safe-area-inset-top))]">
              Ekran automatyczny (wkrótce)
            </div>
          }
        />
        <Route
          path="/settings"
          element={<SettingsScreen groupId={groupId} onLeave={leaveGroup} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
