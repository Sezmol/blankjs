import { createContext, useContext } from "react";
import type { SelectContextValue } from "./types";

export const SelectContext = createContext<SelectContextValue | null>(null);

export const useSelectContext = () => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("[blankjs] Select.* must be used within Select.Root");
  }

  return context;
};
