import { useContext, useMemo } from "react";
import { FieldContext } from "./context";
import type { FieldControlProps } from "./types";

export const useFieldControlProps = (): FieldControlProps => {
  const context = useContext(FieldContext);

  return useMemo<FieldControlProps>(() => {
    if (!context) return {} as FieldControlProps;

    const {
      hasDescription,
      descriptionId,
      hasError,
      errorId,
      controlId,
      disabled,
      required,
      invalid,
    } = context;

    const describedBy =
      [hasDescription && descriptionId, hasError && errorId]
        .filter(Boolean)
        .join(" ") || undefined;

    return {
      "aria-describedby": describedBy,
      "aria-invalid": invalid ? true : undefined,
      "aria-required": required ? true : undefined,
      id: controlId,
      disabled,
    };
  }, [context]);
};
