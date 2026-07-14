import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRightIcon, CheckCircle2 } from "lucide-react";

interface Release {
  version: string;
  date: string;
  changes: string[];
}

export function VersionBadge() {
  const [isOpen, setIsOpen] = useState(false);

  // 1. HISTORIA ZMIAN (Najnowsza wersja ZAWSZE musi być jako PIERWSZA w tablicy!)
  const changelog: Release[] = [
    {
      version: "0.4.0",
      date: "14.07.2026",
      changes: [
        "Dodano menu grupowych zmian (zaznacz/odznacz wszystko, usuwanie).",
        "Wdrożono błyskawiczne optymistyczne UI dla akcji masowych.",
        "Wprowadzono moduł motywów wizualnych i dostosowano kolory komponentów.",
        "Zabezpieczono formularze przed błędami spacji z autokorekty na telefonach.",
        "Zaktualizowano ikony w aplikacji na bardziej spójne.",
        "Dodano widok wersji i historii zmian (Changelog) w ustawieniach.",
      ],
    },
    {
      version: "0.3.0",
      date: "08.07.2026",
      changes: [
        "Całkowita migracja bazy danych na SQLite – większa szybkość i niezawodność.",
        "Wprowadzono system Grup Współdzielonych (dołączanie, opuszczanie, pamięć ostatnich grup).",
        "Rozbudowano produkty o podawanie ilości oraz jednostek miary.",
        "Zmieniono interfejs przycisków na wygodne, wysuwane z dołu menu (Drawers).",
        "Poprawiono płynność animacji rozwijania list i przechodzenia między ekranami.",
      ],
    },
    {
      version: "0.2.0",
      date: "01.07.2026",
      changes: [
        "Dodano system powiadomień na ekranie (Toasty) o sukcesie lub błędzie operacji.",
        "Wdrożono odświeżanie list i produktów w tle na żywo (Live Update).",
        "Naprawiono irytujący błąd z chowającą się klawiaturą podczas wpisywania.",
        "Dodano błyskawiczną reakcję interfejsu przy odhaczaniu produktów (Optimistic Update).",
        "Poprawiono podświetlanie elementów i automatyczne łapanie ostrości (focus) przez formularze.",
      ],
    },
    {
      version: "0.1.0",
      date: "25.06.2026",
      changes: [
        "Pierwsza działająca wersja PWA naszej aplikacji zakupowej.",
        "Podstawowy system zarządzania listami: przeglądanie, tworzenie, edycja i wyszukiwanie.",
        "Połączenie interfejsu (TanStack Query) z autorskim API backendowym.",
        "Uporządkowanie architektury projektu i komponentów interfejsu użytkownika.",
      ],
    },
  ];

  // 2. AUTOMATYZACJA: Pobieramy dane najnowszej wersji z samego góry tablicy
  const latestRelease = changelog[0];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Badge automatycznie wyświetli np. "v0.2.0" na podstawie pierwszego wpisu */}
        <Badge
          variant="secondary"
          className="gap-1.5 cursor-pointer hover:bg-secondary/80 transition-colors active:scale-95 font-mono"
        >
          v{latestRelease.version} <ArrowUpRightIcon className="size-3 opacity-60" />
        </Badge>
      </DialogTrigger>

      <DialogContent className="max-w-[400px] rounded-2xl bg-background border-border">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold">Historia zmian</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto mt-2 pr-1">
          {changelog.map((release) => {
            const isLatest = release.version === latestRelease.version;

            return (
              <div
                key={release.version}
                className="flex flex-col gap-2.5 border-b border-border/50 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-foreground font-mono">
                      v{release.version}
                    </span>
                    {isLatest && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                        Najnowsza
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{release.date}</span>
                </div>

                <ul className="flex flex-col gap-2">
                  {release.changes.map((change, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-foreground/85 leading-relaxed"
                    >
                      <CheckCircle2 className="mr-2 size-4 text-primary shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
