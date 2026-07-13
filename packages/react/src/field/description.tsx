import { useFieldContext } from "@blankjs/core";
import { useEffect, type ComponentProps } from "react";

type FieldDescriptionProps = ComponentProps<"div">;

export const FieldDescription = ({
  children,
  className,
  ...props
}: FieldDescriptionProps) => {
  const { descriptionId, registerDescription } = useFieldContext();

  useEffect(() => registerDescription(), [registerDescription]);

  return (
    <div
      {...props}
      id={descriptionId}
      className={["bk-field-description", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};

FieldDescription.displayName = "Field.Description";
