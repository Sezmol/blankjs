import { createContext, useContext } from "react";
import type { CheckboxGroupContextValue } from "./types";

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextValue | null>(null);

export const useCheckboxGroupContext = () => {
  const context = useContext(CheckboxGroupContext);

  if (!context) {
    throw new Error(
      "[blankjs] CheckboxGroup.* must be used within CheckboxGroup.Root",
    );
  }

  return context;
};
