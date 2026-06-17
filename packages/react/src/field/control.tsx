import { useFieldControlProps } from "@blankjs/core";
import { Slot, type SlotProps } from "../slot";

export const FieldControl = ({
  children,
}: {
  children: SlotProps["children"];
}) => {
  const controlProps = useFieldControlProps();

  return <Slot {...controlProps}>{children}</Slot>;
};

FieldControl.displayName = "Field.Control";
