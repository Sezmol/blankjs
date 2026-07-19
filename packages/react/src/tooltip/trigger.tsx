import type {
  ComponentProps,
  FocusEvent,
  KeyboardEvent,
  PointerEvent,
  ReactElement,
} from "react";
import { composeRefs, Slot } from "../slot";
import { useTooltipContext } from "./context";

type TooltipTriggerProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const TooltipTrigger = ({
  children,
  className,
  ref,
  asChild,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: TooltipTriggerProps) => {
  const {
    contentId,
    setAnchor,
    scheduleOpen,
    scheduleClose,
    closeNow,
    openNow,
  } = useTooltipContext();

  const handlePointerEnter = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerEnter?.(e);

    if (e.pointerType === "touch" || e.defaultPrevented) return;

    scheduleOpen();
  };

  const handlePointerLeave = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(e);

    if (e.pointerType === "touch" || e.defaultPrevented) return;

    scheduleClose();
  };

  const handleFocus = (e: FocusEvent<HTMLButtonElement>) => {
    onFocus?.(e);

    if (e.defaultPrevented || !e.currentTarget.matches(":focus-visible"))
      return;

    openNow();
  };

  const handleBlur = (e: FocusEvent<HTMLButtonElement>) => {
    onBlur?.(e);

    if (e.defaultPrevented) return;

    closeNow();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);

    if (e.defaultPrevented) return;

    if (e.key === "Escape") {
      closeNow();
    }
  };

  const triggerProps: ComponentProps<"button"> = {
    ...props,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    "aria-describedby": contentId,
    type: "button",
    className: ["bk-tooltip-trigger", className].filter(Boolean).join(" "),
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
