import { useFieldContext } from "@blankjs/core";
import { useEffect, type ComponentProps } from "react";

type FieldErrorProps = ComponentProps<"div">;

export const FieldError = ({
  children,
  className,
  ...props
}: FieldErrorProps) => {
  const {
    errorId,
    registerError,
    invalid,
    resolvedErrorMessage,
    validationMessage,
    serverError,
  } = useFieldContext();

  const content =
    children ?? resolvedErrorMessage ?? serverError ?? validationMessage;

  // no text means nothing to announce: a manual `invalid` without children
  // renders nothing rather than an empty error node
  const visible = invalid && content != null && content !== "";

  useEffect(() => {
    if (!visible) return;

    return registerError();
  }, [registerError, visible]);

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
