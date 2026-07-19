import type { ComponentProps, ReactElement } from "react";
import { composeRefs, Slot } from "../slot";
import { usePopoverContext } from "./context";

type PopoverTriggerProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const PopoverTrigger = ({
  children,
  className,
  ref,
  asChild,
  ...props
}: PopoverTriggerProps) => {
  const { contentId, setAnchor } = usePopoverContext();

  const triggerProps: ComponentProps<"button"> = {
    ...props,
    type: "button",
    popoverTarget: contentId,
    className: ["bk-popover-trigger", className].filter(Boolean).join(" "),
  };

  if (asChild) {
    return (
      <Slot {...triggerProps} ref={composeRefs(setAnchor, ref)}>
        {children as ReactElement}
      </Slot>
    );
  }

  return (
    <button {...triggerProps} ref={composeRefs(setAnchor, ref)}>
      {children}
    </button>
  );
};
