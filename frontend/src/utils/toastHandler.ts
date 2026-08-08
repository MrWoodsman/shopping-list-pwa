import { toast } from "sonner";
import { clsx } from "clsx";

const successToastStyles = clsx(
  "bg-[#f0fdf4]!",
  "border-[#bbf7d0]!",
  "text-[#166534]!",
  "dark:bg-[#052e16]!",
  "dark:border-[#14532d]!",
  "dark:text-[#dcfce7]!",
);

const errorToastStyles = clsx(
  "bg-[#fef2f2]!",
  "border-[#fecaca]!",
  "text-[#991b1b]!",
  "dark:bg-[#450a0a]!",
  "dark:border-[#7f1d1d]!",
  "dark:text-[#fee2e2]!",
);

const infoToastStyles = clsx(
  "bg-[#eff6ff]!",
  "border-[#bfdbfe]!",
  "text-[#1e40af]!",
  "dark:bg-[#0f172a]!",
  "dark:border-[#1e3a8a]!",
  "dark:text-[#bfdbfe]!",
);

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    className: successToastStyles,
  });
};

export const showErrorToast = (message: Error | string) => {
  // Sprawdzamy, czy przekazano obiekt Error, czy zwykły tekst
  message = typeof message === "string" ? message : message.message;

  toast.error(message, {
    className: errorToastStyles,
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, { className: infoToastStyles });
};
