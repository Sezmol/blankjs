import { useEffect, useId, type ComponentProps } from "react";
import { useFieldArrayContext } from "./context";

export type FieldArrayErrorProps = ComponentProps<"div">;

export const FieldArrayError = ({
  children,
  className,
  id,
  ...props
}: FieldArrayErrorProps) => {
  const { error, registerError } = useFieldArrayContext();

  const ownId = useId();
  const errorId = id ?? ownId;

  const content = children ?? error;

  const visible = content != null && content !== "";

  useEffect(() => {
    if (!visible) return;

    return registerError(errorId);
  }, [registerError, visible, errorId]);

  if (!visible) return null;

  return (
    <div
      {...props}
      id={errorId}
      className={["bk-field-array-error", className].filter(Boolean).join(" ")}
    >
      {content}
    </div>
  );
};

FieldArrayError.displayName = "FieldArray.Error";
