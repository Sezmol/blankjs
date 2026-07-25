import { createContext, useContext } from "react";
import type { FieldArrayRow } from "@blankjs/core";

export type FieldArrayRowRef = Pick<
  FieldArrayRow<unknown>,
  "key" | "position"
>;

export interface FieldArrayContextValue {
  name: string;
  errorId: string;
  error: string | undefined;

  canAppend: boolean;
  canRemove: boolean;

  appendRow: () => void;
  removeRow: (row: FieldArrayRowRef) => void;
}

export const FieldArrayContext = createContext<FieldArrayContextValue | null>(
  null,
);

export const useFieldArrayContext = () => {
  const context = useContext(FieldArrayContext);

  if (!context) {
    throw new Error("FieldArray parts must be used inside <FieldArray>");
  }

  return context;
};
