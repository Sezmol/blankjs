import type { ComponentProps } from "react";
import { useFieldArrayContext } from "./context";

export type FieldArrayErrorProps = ComponentProps<"div">;

export const FieldArrayError = ({
  children,
  className,
  ...props
}: FieldArrayErrorProps) => {
  const { errorId, error } = useFieldArrayContext();

  const content = children ?? error;

  if (content == null || content === "") return null;

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
