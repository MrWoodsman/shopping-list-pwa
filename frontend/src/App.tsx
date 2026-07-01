import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";
// PAGES
import { ShoppingLists } from "./pages/ShoppingLists";
import { HomeScreen } from "./pages/HomeScreen";
import { Onboarding } from "./components/Onboarding";
import { AppLayout } from "./components/AppLayout";

function App() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("has-seen-onboarding");
  });

  // W App.tsx
  const handleComplete = () => {
    console.log("handleComplete wywołane!");
    localStorage.setItem("has-seen-onboarding", "true");
    setShowOnboarding(false);
    navigate("/shopping-lists");
  };
  return (
    <>
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-background w-full h-full">
          <Onboarding onComplete={handleComplete} />
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route element={<AppLayout />}>
          <Route path="/shopping-lists" element={<ShoppingLists />} />
          <Route
            path="/recipes"
            element={<div className="p-4 text-white">Ekran przepisów (wkrótce)</div>}
          />
          <Route
            path="/settings"
            element={<div className="p-4 text-white">Ekran ustawień (wkrótce)</div>}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
