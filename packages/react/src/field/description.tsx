import { useFieldContext } from "@blankjs/core";
import { useEffect, useId, type ComponentProps } from "react";

export type FieldDescriptionProps = ComponentProps<"div">;

export const FieldDescription = ({
  children,
  className,
  id,
  ...props
}: FieldDescriptionProps) => {
  const { registerDescription } = useFieldContext();

  const ownId = useId();
  const descriptionId = id ?? ownId;

  useEffect(
    () => registerDescription(descriptionId),
    [registerDescription, descriptionId],
  );

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
