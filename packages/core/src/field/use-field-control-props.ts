import { useMemo } from "react";
import { useFieldContext } from "./context";
import type { FieldControlProps } from "./types";

export const useFieldControlProps = (): FieldControlProps => {
  const {
    hasDescription,
    descriptionId,
    hasError,
    errorId,
    controlId,
    disabled,
    required,
    invalid,
  } = useFieldContext();

  return useMemo(() => {
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
  }, [
    hasDescription,
    descriptionId,
    hasError,
    errorId,
    controlId,
    disabled,
    required,
    invalid,
  ]);
};
