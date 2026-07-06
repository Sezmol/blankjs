import { createContext, useContext } from "react";
import type { RadioGroupContextValue } from "./types";

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null,
);

export const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error(
      "[blankjs] RadioGroup.* must be used within RadioGroup.Root",
    );
  }

  return context;
};
