import { useFieldContext } from "@blankjs/core";
import { useEffect, type ComponentProps } from "react";

type FieldErrorProps = ComponentProps<"div"> & {
  match?: keyof ValidityState;
};

export const FieldError = ({ children, match, ...props }: FieldErrorProps) => {
  const {
    errorId,
    registerError,
    invalid,
    validity,
    validationMessage,
    serverError,
  } = useFieldContext();

  const visible = match ? validity?.[match] === true : invalid;

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    if (visible) {
      cleanup = registerError();
    }

    return () => cleanup?.();
  }, [registerError, visible]);

  if (!visible) return null;

  return (
    <div {...props} id={errorId}>
      {children ?? serverError ?? validationMessage}
    </div>
  );
};

FieldError.displayName = "Field.Error";
