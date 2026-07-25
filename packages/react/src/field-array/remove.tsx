import type { ComponentProps, ReactElement } from "react";
import { Slot } from "../slot";
import { useFieldArrayContext, type FieldArrayRowRef } from "./context";

export interface FieldArrayRemoveProps extends ComponentProps<"button"> {
  asChild?: boolean;
  row: FieldArrayRowRef;
}

export const FieldArrayRemove = ({
  children,
  className,
  asChild,
  disabled,
  onClick,
  row,
  ...props
}: FieldArrayRemoveProps) => {
  const { name, canRemove, removeRow } = useFieldArrayContext();

  const buttonProps = {
    ...(asChild ? null : { type: "button" as const }),
    ...props,
    "data-bk-field-array-remove": name,
    "data-bk-field-array-row": row.key,
    disabled: disabled || !canRemove,
    className: ["bk-field-array-remove", className].filter(Boolean).join(" "),
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) removeRow(row);
    },
  };

  if (asChild) {
    return <Slot {...buttonProps}>{children as ReactElement}</Slot>;
  }

  return <button {...buttonProps}>{children}</button>;
};

FieldArrayRemove.displayName = "FieldArray.Remove";
