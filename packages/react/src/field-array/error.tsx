import { useEffect, type ComponentProps } from "react";
import { useFieldArrayContext } from "./context";

export type FieldArrayErrorProps = ComponentProps<"div">;

export const FieldArrayError = ({
  children,
  className,
  ...props
}: FieldArrayErrorProps) => {
  const { errorId, error, registerError } = useFieldArrayContext();

  const content = children ?? error;

  const visible = content != null && content !== "";

  useEffect(() => {
    if (!visible) return;

    return registerError();
  }, [registerError, visible]);

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
