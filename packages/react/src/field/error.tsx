import { useFieldContext } from "@blankjs/core";
import { useEffect, type ComponentProps } from "react";

type FieldErrorProps = ComponentProps<"div">;

export const FieldError = ({ children, ...props }: FieldErrorProps) => {
  const { errorId, registerError } = useFieldContext();

  useEffect(() => registerError(), [registerError]);

  return (
    <div {...props} id={errorId}>
      {children}
    </div>
  );
};

FieldError.displayName = "Field.Error";
