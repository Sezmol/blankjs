import { useFieldContext } from "@blankjs/core";
import { useEffect, type ComponentProps } from "react";

type FieldDescriptionProps = ComponentProps<"div">;

export const FieldDescription = ({
  children,
  ...props
}: FieldDescriptionProps) => {
  const { descriptionId, registerDescription } = useFieldContext();

  useEffect(() => registerDescription(), [registerDescription]);

  return (
    <div {...props} id={descriptionId}>
      {children}
    </div>
  );
};

FieldDescription.displayName = "Field.Description";
