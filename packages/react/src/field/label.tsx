import { useFieldContext } from "@blankjs/core";
import { useEffect, type ComponentProps } from "react";

type FieldLabelProps = ComponentProps<"label">;

export const FieldLabel = ({ children, ...props }: FieldLabelProps) => {
  const { controlId, labelId, registerLabel } = useFieldContext();

  useEffect(() => registerLabel(), [registerLabel]);

  return (
    <label {...props} id={labelId} htmlFor={controlId}>
      {children}
    </label>
  );
};

FieldLabel.displayName = "Field.Label";
