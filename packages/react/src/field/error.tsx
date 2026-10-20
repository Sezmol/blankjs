import { useFieldContext } from "@blankjs/core";
import { useEffect, useId, type ComponentProps } from "react";

export type FieldErrorProps = ComponentProps<"div">;

export const FieldError = ({
  children,
  className,
  id,
  ...props
}: FieldErrorProps) => {
  const {
    registerError,
    invalid,
    resolvedErrorMessage,
    validationMessage,
    serverError,
  } = useFieldContext();

  const content =
    children ?? resolvedErrorMessage ?? serverError ?? validationMessage;

  const visible = invalid && content != null && content !== "";

  const ownId = useId();
  const errorId = id ?? ownId;

  useEffect(() => {
    if (!visible) return;

    return registerError(errorId);
  }, [registerError, visible, errorId]);

  if (!visible) return null;

  return (
    <div
      {...props}
      id={errorId}
      className={["bk-field-error", className].filter(Boolean).join(" ")}
    >
      {content}
    </div>
  );
};

FieldError.displayName = "Field.Error";
