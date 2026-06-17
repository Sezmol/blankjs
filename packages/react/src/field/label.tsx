import { useFieldContext } from "@blankjs/core";
import type { ComponentProps } from "react";

type FieldLabelProps = ComponentProps<"label">;

export const FieldLabel = ({ children, ...props }: FieldLabelProps) => {
  const { controlId } = useFieldContext();

  return (
    <label {...props} htmlFor={controlId}>
      {children}
    </label>
  );
};

FieldLabel.displayName = "Field.Label";
