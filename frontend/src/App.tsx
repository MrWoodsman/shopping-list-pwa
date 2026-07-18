import { useState } from "react";
import { ROUTES } from "@/config/routes";
import { Routes, Route, Navigate } from "react-router-dom";
import { useGroup } from "./hooks/useGroup";
// COMPONENTS
import { OnBoardingOverlay } from "./components/overlay/OnBoardingOverlay";
import { AppLayout } from "./components/layout/AppLayout";
// SCREENS
import { ShoppingListsScreen } from "./pages/ShoppingListsScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { ShoppingScreen } from "./pages/ShoppingScreen";
import { SettingsScreen } from "./pages/SettingsScreen";
import { RecipesScreen } from "./pages/RecipesScreen"; // (dopasuj ścieżkę)
import { AutoListScreen } from "./pages/AutoListScreen";
import { ShoppingAllScreen } from "./pages/ShoppingAllScreen";

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
        <OnBoardingOverlay onComplete={handleCompleteOnboarding} />
      </div>
    );
  }

  // 2. STRAŻNIK: GRUPA (Jeśli nie masz grupy, widzisz tylko ten ekran wpisywania)
  if (!groupId) {
    return <HomeScreen onJoin={joinGroup} />;
  }

  return (
    <Routes>
      {/* Przekierowanie */}
      <Route path="/" element={<Navigate to={ROUTES.SHOPPING_LISTS} replace />} />
      {/* Sciezki aplikacji */}
      <Route element={<AppLayout />}>
        <Route path={ROUTES.SHOPPING_LISTS} element={<ShoppingListsScreen />} />
        <Route path={ROUTES.SHOPPING_ALL} element={<ShoppingAllScreen />} />
        <Route path={ROUTES.LIST_DETAIL(":id")} element={<ShoppingScreen />} />
        <Route path={ROUTES.RECIPES} element={<RecipesScreen />} />
        <Route path={ROUTES.AUTO_LIST} element={<AutoListScreen />} />
        <Route
          path={ROUTES.SETTINGS}
          element={<SettingsScreen groupId={groupId} onLeave={leaveGroup} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
