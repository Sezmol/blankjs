import { useCallback, useId, useMemo, useState } from "react";
import type { FieldContextValue, UseFieldRootOptions } from "./types";

export const useFieldRoot = (
  options?: UseFieldRootOptions,
): FieldContextValue => {
  const { invalid = false, disabled = false, required = false } = options ?? {};

  const controlId = useId();
  const labelId = useId();
  const descriptionId = useId();
  const errorId = useId();

  const [hasLabel, setHasLabel] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const [hasError, setHasError] = useState(false);

  const registerLabel = useCallback(() => {
    setHasLabel(true);

    return () => setHasLabel(false);
  }, []);

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
      labelId,
      descriptionId,
      errorId,

      invalid,
      disabled,
      required,

      hasLabel,
      hasDescription,
      hasError,
      registerLabel,
      registerDescription,
      registerError,
    }),
    [
      controlId,
      labelId,
      descriptionId,
      errorId,
      invalid,
      disabled,
      required,
      hasLabel,
      hasDescription,
      hasError,
      registerLabel,
      registerDescription,
      registerError,
    ],
  );
};
