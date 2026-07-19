import type { ComponentProps, ReactElement } from "react";
import { usePopoverContext } from "./context";
import { Slot } from "../slot";

type PopoverCloseProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const PopoverClose = ({
  className,
  children,
  asChild,
  ...props
}: PopoverCloseProps) => {
  const { contentId } = usePopoverContext();

  const closeProps: ComponentProps<"button"> = {
    ...props,
    type: "button",
    popoverTarget: contentId,
    popoverTargetAction: "hide",
    className: ["bk-popover-close", className].filter(Boolean).join(" "),
  };

  if (asChild) {
    return <Slot {...closeProps}>{children as ReactElement}</Slot>;
  }

  return <button {...closeProps}>{children}</button>;
};
