import { createContext, useContext } from "react";
import type { MultiSelectContextValue } from "./types";

export const MultiSelectContext = createContext<MultiSelectContextValue | null>(
  null,
);

export const useMultiSelectContext = () => {
  const context = useContext(MultiSelectContext);

  if (!context) {
    throw new Error(
      "[blankjs] MultiSelect.* must be used within MultiSelect.Root",
    );
  }

  return context;
};
