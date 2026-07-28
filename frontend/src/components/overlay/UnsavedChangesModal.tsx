import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function UnsavedChangesModal({ isOpen, onOpenChange, onConfirm }: UnsavedChangesModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[90%] rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Niezapisane zmiany</AlertDialogTitle>
          <AlertDialogDescription>
            Masz niezapisane zmiany w przepisie. Czy na pewno chcesz wyjść bez zapisywania? Cała
            Twoja praca przepadnie.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row items-center gap-3 mt-4">
          <AlertDialogCancel className="mt-0 flex-1">Wróć do edycji</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            variant="outline"
            className="flex-1 border-2 border-destructive/20 text-destructive bg-destructive/10 hover:bg-destructive/10 hover:text-destructive"
          >
            Tak, wyjdź
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
