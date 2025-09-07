import { toast } from "svelte-sonner";

export function useErrorToast(errorCondition: () => boolean, errorMessage: string | (() => string)) {
  let toastId: string | number | undefined;

  $effect(() => {
    const hasError = errorCondition();
    const message = typeof errorMessage === "function" ? errorMessage() : errorMessage;

    if (hasError && message) {
      // Dismiss any existing toast before showing new one
      if (toastId) {
        toast.dismiss(toastId);
      }

      toastId = toast.error(message, {
        duration: Infinity,
      });

      // Cleanup function to dismiss toast when error clears
      return () => {
        if (toastId) {
          toast.dismiss(toastId);
          toastId = undefined;
        }
      };
    }
  });
}
