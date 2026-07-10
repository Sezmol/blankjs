import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { useEffect } from "react";

export type MatchWidth = "exact" | "min";

export interface UsePopoverOptions {
  anchor: HTMLElement | null;
  onDismiss: (reason: "escape" | "outside-press") => void;
  matchWidth?: MatchWidth;
}

const matchWidthMap: Record<MatchWidth, string> = {
  exact: "width",
  min: "minWidth",
};

export const usePopover = ({
  anchor,
  onDismiss,
  matchWidth,
}: UsePopoverOptions) => {
  const { refs, floatingStyles, elements } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ elements: floatingState, rects }) {
          Object.assign(floatingState.floating.style, {
            [matchWidthMap[matchWidth ?? "exact"]]:
              `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    elements: { reference: anchor },
  });

  const { setFloating } = refs;

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

      if (elements.floating?.contains(target)) return;
      if (anchor?.contains(target)) return;

      onDismiss("outside-press");
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchor, elements.floating, onDismiss]);

  return { setFloating, floatingStyles };
};
