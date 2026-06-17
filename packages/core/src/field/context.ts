import { createContext, useContext } from "react";
import type { FieldContextValue } from "./types";

export const FieldContext = createContext<FieldContextValue | null>(null);

export const useFieldContext = () => {
  const context = useContext(FieldContext);

  if (!context) {
    throw new Error("[blankjs] Field.* must be used within Field.Root");
  }

  return context;
};
