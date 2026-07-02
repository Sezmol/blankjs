import { useEffect, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { useSelectContext } from "./context";

export interface SelectContentProps extends ComponentProps<"div"> {
  container?: HTMLElement;
}

const SelectContentInner = ({
  children,
  style,
  className,
  container,
  ...props
}: SelectContentProps) => {
  const { triggerElement, listboxId, setOpen, getItems, value, setActiveItem } =
    useSelectContext();

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
      value !== undefined
        ? items.find((item) => item.value === value)
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
      className={["bk-select-content", className].filter(Boolean).join(" ")}
      role="listbox"
      id={listboxId}
    >
      {children}
    </div>,
    target,
  );
};

export const SelectContent = ({ children, ...props }: SelectContentProps) => {
  const { open } = useSelectContext();

  if (!open) return null;

  return <SelectContentInner {...props}>{children}</SelectContentInner>;
};

SelectContent.displayName = "Select.Content";
