import { useCallback, useId, useMemo, useState } from "react";
import type { FieldContextValue, UseFieldRootOptions } from "./types";

export const useFieldRoot = (
  options?: UseFieldRootOptions,
): FieldContextValue => {
  const { invalid = false, disabled = false, required = false } = options ?? {};

  const controlId = useId();
  const descriptionId = useId();
  const errorId = useId();

  const [hasDescription, setHasDescription] = useState(false);
  const [hasError, setHasError] = useState(false);

  const registerDescription = useCallback(() => {
    setHasDescription(true);

    return () => setHasDescription(false);
  }, []);

  const registerError = useCallback(() => {
    setHasError(true);

    return () => setHasError(false);
  }, []);

  return useMemo(
    () => ({
      controlId,
      descriptionId,
      errorId,

      invalid,
      disabled,
      required,

      hasDescription,
      hasError,
      registerDescription,
      registerError,
    }),
    [
      controlId,
      descriptionId,
      errorId,
      invalid,
      disabled,
      required,
      hasDescription,
      hasError,
      registerDescription,
      registerError,
    ],
  );
};
