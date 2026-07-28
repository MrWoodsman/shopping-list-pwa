import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ConfirmModal({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  cancelText = "Anuluj",
  confirmText = "Potwierdź",
  confirmVariant = "default",
}: ConfirmModalProps) {
  // Jeśli modal jest zamknięty, w ogóle go nie renderujemy
  if (!isOpen) return null;

  return (
    // Tło przyciemniające (Overlay)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
      {/* Pudełko modala */}
      <div className="bg-background w-full max-w-85 rounded-2xl p-6 shadow-xl border border-border/50 animate-in zoom-in-95 duration-200">
        {/* Tytuł */}
        <h2 className="text-lg font-semibold tracking-tight mb-2 text-foreground">{title}</h2>

        {/* Opis */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>

        {/* Przyciski */}
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            className="flex-1"
            onClick={() => {
              // Wywołujemy akcję (np. usuwanie z bazy)
              onConfirm();
              // (Opcjonalnie możesz tutaj z automatu robić onOpenChange(false),
              // ale lepiej zamykać modal z poziomu rodzica DOPIERO, gdy akcja się powiedzie)
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
