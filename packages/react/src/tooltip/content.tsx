import {
  useEffect,
  useRef,
  type ComponentProps,
  type PointerEvent,
  type ToggleEvent,
} from "react";
import { useFloatingPosition, type Placement } from "../internal";
import { useTooltipContext } from "./context";
import { composeRefs } from "../slot";

type TooltipContentProps = ComponentProps<"div"> & {
  placement?: Placement;
};

export const TooltipContent = ({
  placement = "top",
  children,
  className,
  style,
  ref,
  onToggle,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TooltipContentProps) => {
  const {
    anchor,
    contentId,
    openNow,
    closeNow,
    open,
    cancelClose,
    scheduleClose,
  } = useTooltipContext();

  const { floatingStyles, setFloating } = useFloatingPosition({
    anchor,
    placement,
  });

  const innerRef = useRef<HTMLDivElement>(null);

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

    if (e.newState === "open") {
      openNow();
    } else if (e.newState === "closed") {
      closeNow();
    }
  };

  const handlePointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    onPointerEnter?.(e);

    if (e.defaultPrevented) return;

    cancelClose();
  };

  const handlePointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);

    if (e.defaultPrevented) return;

    scheduleClose();
  };

  return (
    <div
      {...props}
      onToggle={handleToggle}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      id={contentId}
      popover="hint"
      role="tooltip"
      ref={composeRefs<HTMLDivElement>(ref, innerRef, setFloating)}
      style={{ ...style, ...floatingStyles }}
      className={["bk-tooltip-content", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};
