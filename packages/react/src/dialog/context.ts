import { createContext, useContext } from "react";
import type { DialogContextValue } from "./types";

export const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("[blankjs] Dialog.* must be used within Dialog.Root");
  }

  return context;
};
