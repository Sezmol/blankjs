import { useEffect, useState, type ComponentProps } from "react";
import { useMultiSelectContext } from "./context";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";

export interface MultiSelectContentProps extends ComponentProps<"div"> {
  container?: HTMLElement;
}

const MultiSelectContentInner = ({
  children,
  style,
  className,
  container,
  ...props
}: MultiSelectContentProps) => {
  const { triggerElement, listboxId, setOpen, getItems, value, setActiveItem } =
    useMultiSelectContext();

  const { refs, floatingStyles, elements } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ elements: floatingState, rects }) {
          Object.assign(floatingState.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    elements: { reference: triggerElement },
  });

  const { setFloating } = refs;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;

      e.preventDefault();

      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      if (elements.floating?.contains(target)) return;
      if (triggerElement?.contains(target)) return;

      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [setOpen, triggerElement, elements.floating]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const items = getItems();
    const selected =
      value.length > 0
        ? items.find((item) => value.includes(item.value))
        : undefined;

    setActiveItem(selected ?? items[0]);

    return () => setActiveItem(undefined);
    // re-runs when mounted flips true: the commit after Items registered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return null;

  const target = container ?? document.body;

  return createPortal(
    <div
      {...props}
      ref={setFloating}
      style={{ ...style, ...floatingStyles }}
      className={["bk-multi-select-content", className]
        .filter(Boolean)
        .join(" ")}
      role="listbox"
      aria-multiselectable="true"
      id={listboxId}
    >
      {children}
    </div>,
    target,
  );
};

export const MultiSelectContent = ({
  children,
  ...props
}: MultiSelectContentProps) => {
  const { open } = useMultiSelectContext();

  if (!open) return null;

  return (
    <MultiSelectContentInner {...props}>{children}</MultiSelectContentInner>
  );
};

MultiSelectContent.displayName = "MultiSelect.Content";
