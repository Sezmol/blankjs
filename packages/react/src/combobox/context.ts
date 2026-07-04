import { createContext, useContext } from "react";
import type { ComboboxContextValue } from "./types";

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);

export const useComboboxContext = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error("[blankjs] Combobox.* must be used within Combobox.Root");
  }

  return context;
};
