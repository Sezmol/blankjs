import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import { useEffect, type CSSProperties } from "react";

export type MatchWidth = "exact" | "min" | "none";

export type { Placement };

export interface UseFloatingPositionOptions {
  anchor: HTMLElement | null;
  placement?: Placement;
  matchWidth?: MatchWidth;
}

export interface UsePopoverOptions {
  anchor: HTMLElement | null;
  onDismiss: (reason: "escape" | "outside-press") => void;
  matchWidth?: Exclude<MatchWidth, "none">;
}

const matchWidthMap = {
  exact: "width",
  min: "minWidth",
};

export interface FloatingPosition {
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  floatingElement: HTMLElement | null;
}

export const useFloatingPosition = ({
  anchor,
  placement = "bottom-start",
  matchWidth = "none",
}: UseFloatingPositionOptions): FloatingPosition => {
  const { refs, floatingStyles, elements } = useFloating({
    placement,
    // position via top/left so CSS keeps transform free for animations
    transform: false,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      matchWidth !== "none" &&
        size({
          apply({ elements: floatingState, rects }) {
            Object.assign(floatingState.floating.style, {
              [matchWidthMap[matchWidth]]: `${rects.reference.width}px`,
            });
          },
        }),
    ],
    whileElementsMounted: autoUpdate,
    elements: { reference: anchor },
  });

  // floating-ui types the param without null, which breaks composeRefs with React refs
  const setFloating: (node: HTMLElement | null) => void = refs.setFloating;

  return { setFloating, floatingStyles, floatingElement: elements.floating };
};

export const usePopover = ({
  anchor,
  onDismiss,
  matchWidth = "exact",
}: UsePopoverOptions) => {
  const { setFloating, floatingStyles, floatingElement } = useFloatingPosition({
    anchor,
    matchWidth,
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;

      e.preventDefault();

      onDismiss("escape");
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      if (floatingElement?.contains(target)) return;
      if (anchor?.contains(target)) return;

      onDismiss("outside-press");
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchor, floatingElement, onDismiss]);

  return { setFloating, floatingStyles };
};
