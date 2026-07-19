import type { ComponentProps, KeyboardEvent, ReactElement } from "react";
import { composeRefs, Slot } from "../slot";
import { useMenuContext } from "./context";

type MenuTriggerProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const MenuTrigger = ({
  children,
  className,
  ref,
  asChild,
  onKeyDown,
  ...props
}: MenuTriggerProps) => {
  const { contentId, setAnchor, open, setOpen, getItems, setActiveItem } =
    useMenuContext();

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);

    if (e.defaultPrevented || open) return;

    if (!["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) return;

    // preventDefault also suppresses the native click Enter/Space would
    // produce, so the popovertarget toggle cannot fire a second time
    e.preventDefault();

    const items = getItems();

    setActiveItem(e.key === "ArrowUp" ? items[items.length - 1] : items[0]);
    setOpen(true);
  };

  const triggerProps: ComponentProps<"button"> = {
    ...props,
    type: "button",
    popoverTarget: contentId,
    onKeyDown: handleKeyDown,
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": contentId,
    className: ["bk-menu-trigger", className].filter(Boolean).join(" "),
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
