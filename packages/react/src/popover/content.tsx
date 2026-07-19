import {
  useEffect,
  useRef,
  type ComponentProps,
  type ToggleEvent,
} from "react";
import { useFloatingPosition, type Placement } from "../internal";
import { usePopoverContext } from "./context";
import { composeRefs } from "../slot";

type PopoverContentProps = ComponentProps<"div"> & {
  placement?: Placement;
};

export const PopoverContent = ({
  placement,
  children,
  className,
  style,
  ref,
  onToggle,
  ...props
}: PopoverContentProps) => {
  const { anchor, contentId, open, setOpen } = usePopoverContext();

  const innerRef = useRef<HTMLDivElement>(null);

  const { floatingStyles, setFloating } = useFloatingPosition({
    anchor,
    placement,
  });

  useEffect(() => {
    const content = innerRef.current;

    if (!content) return;

    const shown = content.matches(":popover-open");

    if (open && !shown) {
      content.showPopover();
    } else if (!open && shown) {
      content.hidePopover();
    }
  }, [open]);

  const handleToggle = (e: ToggleEvent<HTMLDivElement>) => {
    onToggle?.(e);

    if (e.defaultPrevented) return;

    setOpen(e.newState === "open");
  };

  return (
    <div
      {...props}
      onToggle={handleToggle}
      id={contentId}
      popover="auto"
      ref={composeRefs<HTMLDivElement>(ref, innerRef, setFloating)}
      style={{ ...style, ...floatingStyles }}
      className={["bk-popover-content", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};
