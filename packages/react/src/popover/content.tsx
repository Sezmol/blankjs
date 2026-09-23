import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ToggleEvent,
} from "react";
import { useFloatingPosition, type Placement } from "../internal";
import { usePopoverContext } from "./context";
import { composeRefs } from "../slot";

export type PopoverContentProps = ComponentProps<"div"> & {
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
  const [toggles, setToggles] = useState(0);

  const { floatingStyles, setFloating } = useFloatingPosition({
    anchor,
    placement,
  });

  useEffect(() => {
    const content = innerRef.current;

    if (open && content && !content.matches(":popover-open")) {
      content.showPopover();
    }
  }, [open]);

  useEffect(() => {
    const content = innerRef.current;

    if (!open && content?.matches(":popover-open")) {
      content.hidePopover();
    }
  }, [open, toggles]);

  const handleToggle = (e: ToggleEvent<HTMLDivElement>) => {
    onToggle?.(e);

    if (e.defaultPrevented) return;

    setOpen(e.newState === "open");
    setToggles((count) => count + 1);
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
