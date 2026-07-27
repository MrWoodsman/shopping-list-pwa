import { useState } from "react";
import { Button } from "@/components/ui/button"; // Upewnij się, że masz poprawną ścieżkę
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus, Clock } from "lucide-react";

interface RecipeAddOverlayProps {
  children: React.ReactNode;
  onAddNew?: () => void;
  onOpenDrafts?: () => void;
}

export function RecipeAddOverlay({ children, onAddNew, onOpenDrafts }: RecipeAddOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateNew = () => {
    setIsOpen(false);
    if (onAddNew) onAddNew();
  };

  const handleOpenDrafts = () => {
    setIsOpen(false);
    if (onOpenDrafts) onOpenDrafts();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="bg-background border-border px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 text-left">
          <DrawerTitle>Zarządzanie przepisami</DrawerTitle>
          <DrawerDescription>
            Dodaj nowy przepis lub wróć do nieskończonych szkiców.
          </DrawerDescription>
        </DrawerHeader>

        {/* Skopiowane 1:1 z Twojego starego kodu (gap-4 py-2) */}
        <div className="flex flex-col gap-4 py-2">
          <Button
            className="w-full h-11 flex items-center justify-center gap-2"
            onClick={handleCreateNew}
          >
            <Plus className="w-5 h-5" />
            Utwórz nowy przepis
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-2"
            onClick={handleOpenDrafts}
          >
            <Clock className="w-5 h-5 text-muted-foreground" />
            Przepisy do dokończenia
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
