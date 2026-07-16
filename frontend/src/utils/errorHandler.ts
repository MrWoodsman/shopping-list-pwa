import { toast } from "sonner";

export const showErrorToast = (error: Error | string) => {
  // Sprawdzamy, czy przekazano obiekt Error, czy zwykły tekst
  const message = typeof error === "string" ? error : error.message;

  toast.error(message, {
    className: "bg-red-950! border-red-800! text-red-200!",
  });
};
