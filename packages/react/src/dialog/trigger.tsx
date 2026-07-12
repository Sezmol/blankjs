import type { ComponentProps, MouseEvent, ReactElement } from "react";
import { Slot } from "../slot";
import { useDialogContext } from "./context";

type DialogTriggerProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const DialogTrigger = ({
  asChild,
  children,
  className,
  onClick,
  ...props
}: DialogTriggerProps) => {
  const { setOpen } = useDialogContext();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    setOpen(true);
  };

  const triggerProps: ComponentProps<"button"> = {
    type: "button",
    className: ["bk-dialog-trigger", className].filter(Boolean).join(" "),
    "aria-haspopup": "dialog",
    onClick: handleClick,
    ...props,
  };

  if (asChild) {
    return <Slot {...triggerProps}>{children as ReactElement}</Slot>;
  }

  return <button {...triggerProps}>{children}</button>;
};

DialogTrigger.displayName = "Dialog.Trigger";
