import { Button } from "@/components/ui/button";

export function SettingsScreen({ groupId, onLeave }: { groupId: string; onLeave: () => void }) {
  return (
    <div className="p-4 space-y-6 pt-[max(16px,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-bold">Ustawienia</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-medium text-neutral-400">Twoja Grupa (ID)</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Podaj ten kod osobie, z którą chcesz współdzielić listy zakupów.
          </p>
        </div>

        <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-neutral-800">
          <span className="text-xl font-mono font-bold tracking-widest text-primary">
            {groupId}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(groupId);
              alert("Skopiowano kod do schowka!"); // W przyszłości podmienisz to na ładnego Toasta
            }}
          >
            Kopiuj
          </Button>
        </div>
      </div>

      {/* Na samym dole ekranu z daleka od innych opcji */}
      <div className="pt-8">
        <Button variant="destructive" className="w-full h-12 text-lg" onClick={onLeave}>
          Opuść grupę
        </Button>
      </div>
    </div>
  );
}
