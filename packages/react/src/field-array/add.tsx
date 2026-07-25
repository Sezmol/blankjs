import type { ComponentProps, ReactElement } from "react";
import { Slot } from "../slot";
import { useFieldArrayContext } from "./context";

export interface FieldArrayAddProps extends ComponentProps<"button"> {
  asChild?: boolean;
}

export const FieldArrayAdd = ({
  children,
  className,
  asChild,
  disabled,
  onClick,
  ...props
}: FieldArrayAddProps) => {
  const { name, canAppend, appendRow } = useFieldArrayContext();

  const buttonProps = {
    ...(asChild ? null : { type: "button" as const }),
    ...props,
    "data-bk-field-array-add": name,
    disabled: disabled || !canAppend,
    className: ["bk-field-array-add", className].filter(Boolean).join(" "),
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) appendRow();
    },
  };

  if (asChild) {
    return <Slot {...buttonProps}>{children as ReactElement}</Slot>;
  }

  return <button {...buttonProps}>{children}</button>;
};

FieldArrayAdd.displayName = "FieldArray.Add";
