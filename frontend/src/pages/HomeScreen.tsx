import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Definiujemy, że komponent przyjmuje funkcję onJoin z App.tsx
interface HomeScreenProps {
  onJoin: (id: string) => void;
}

export function HomeScreen({ onJoin }: HomeScreenProps) {
  const navigate = useNavigate();
  // Stan do trzymania tego, co wpisujesz w pole
  const [groupId, setGroupId] = useState("");

  const handleJoin = () => {
    if (groupId.trim().length > 0) {
      // Dobra praktyka: zamieniamy spacje na myślniki i robimy małe litery,
      // żeby uniknąć pomyłek typu "Dom" vs "dom"
      const normalizedId = groupId.trim().toUpperCase().replace(/\s+/g, "-");
      onJoin(normalizedId);
      navigate("/shopping-lists", { replace: true });
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 pt-[max(16px,env(safe-area-inset-top))]">
      {/* Sekcja graficzna */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-32 aspect-square bg-neutral-700 rounded-2xl shadow-lg"></div>
      </div>

      {/* Sekcja formularza */}
      <div className="flex flex-col gap-6 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Dołącz do grupy</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Wpisz ID grupy, aby zarządzać wspólnymi zakupami.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Input
            placeholder="np. dom-kuchnia-99"
            className="h-12 text-lg uppercase"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            // Obsługa klawiatury – żeby dało się zatwierdzić enterem na telefonie
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoin();
            }}
          />
          <p className="text-xs text-neutral-500 px-1">
            Wskazówka: Użyj unikalnego ID (np.{" "}
            <span className="font-mono text-neutral-300">moje-zakupy-2026</span>), aby uniknąć
            połączenia z obcą grupą.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full h-12"
          disabled={groupId.trim().length === 0} // Wyłączamy przycisk, gdy pole jest puste
          onClick={handleJoin}
        >
          Połącz z grupą
        </Button>
      </div>
    </div>
  );
}
