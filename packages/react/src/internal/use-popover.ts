import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import { useEffect, useMemo, type CSSProperties } from "react";

export type MatchWidth = "exact" | "min" | "none";

export type Strategy = "absolute" | "fixed";

export type { Placement };

export interface UseFloatingPositionOptions {
  anchor: HTMLElement | null;
  placement?: Placement;
  matchWidth?: MatchWidth;
  strategy?: Strategy;
}

export interface UsePopoverOptions {
  anchor: HTMLElement | null;
  onDismiss: (reason: "escape" | "outside-press") => void;
  matchWidth?: Exclude<MatchWidth, "none">;
  strategy?: Strategy;
}

const matchWidthMap = {
  exact: "width",
  min: "minWidth",
};

const oppositeSide = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
} as const;

const transformOrigin = (placement: Placement) => {
  const [side, align] = placement.split("-") as [
    keyof typeof oppositeSide,
    "start" | "end" | undefined,
  ];

  const anchored = oppositeSide[side];

  if (side === "top" || side === "bottom") {
    const x = align === "start" ? "left" : align === "end" ? "right" : "center";

    return `${x} ${anchored}`;
  }

  const y = align === "start" ? "top" : align === "end" ? "bottom" : "center";

  return `${anchored} ${y}`;
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
  strategy = "absolute",
}: UseFloatingPositionOptions): FloatingPosition => {
  const {
    refs,
    floatingStyles,
    elements,
    placement: resolvedPlacement,
  } = useFloating({
    placement,
    strategy,
    transform: false,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ elements: floatingState, rects, availableHeight }) {
          floatingState.floating.style.setProperty(
            "--bk-available-height",
            `${availableHeight}px`,
          );

          if (matchWidth === "none") return;

          Object.assign(floatingState.floating.style, {
            [matchWidthMap[matchWidth]]: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    elements: { reference: anchor },
  });

  const setFloating: (node: HTMLElement | null) => void = refs.setFloating;

  const styles = useMemo(
    () => ({
      ...floatingStyles,
      transformOrigin: transformOrigin(resolvedPlacement),
    }),
    [floatingStyles, resolvedPlacement],
  );

  return {
    setFloating,
    floatingStyles: styles,
    floatingElement: elements.floating,
  };
};

export const usePopover = ({
  anchor,
  onDismiss,
  matchWidth = "exact",
  strategy,
}: UsePopoverOptions) => {
  const { setFloating, floatingStyles, floatingElement } = useFloatingPosition({
    anchor,
    matchWidth,
    strategy,
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
