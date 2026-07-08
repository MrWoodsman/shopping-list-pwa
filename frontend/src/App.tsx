import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useGroup } from "./hooks/useGroup";
// COMPONENTS
import { Onboarding } from "./components/Onboarding";
import { AppLayout } from "./components/AppLayout";
// SCREENS
import { ShoppingLists } from "./pages/ShoppingLists";
import { HomeScreen } from "./pages/HomeScreen";
import { ShoppingScreen } from "./pages/ShoppingScreen";
import { SettingsScreen } from "./pages/SettingsScreen";
import { RecipesScreen } from "./pages/RecipesScreen"; // (dopasuj ścieżkę)
import { AutoListScreen } from "./pages/AutoListScreen";

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
        <Route path="/recipes" element={<RecipesScreen />} />
        <Route path="/auto-list" element={<AutoListScreen />} />
        <Route
          path="/settings"
          element={<SettingsScreen groupId={groupId} onLeave={leaveGroup} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
