import {
  Children,
  useEffect,
  useState,
  type ComponentProps,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { useComboboxContext } from "./context";

export interface ComboboxContentProps extends ComponentProps<"div"> {
  container?: HTMLElement;
}

const ComboboxContentInner = ({
  children,
  style,
  className,
  container,
  ...props
}: ComboboxContentProps) => {
  const {
    inputGroupElement,
    listboxId,
    setOpen,
    getItems,
    value,
    setActiveItem,
    revertInputValue,
  } = useComboboxContext();

  const { refs, floatingStyles, elements } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ elements: floatingState, rects }) {
          Object.assign(floatingState.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    elements: { reference: inputGroupElement },
  });

  const { setFloating } = refs;

  const [mounted, setMounted] = useState(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    props.onPointerDown?.(e);

    if (e.defaultPrevented) return;

    e.preventDefault();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;

      e.preventDefault();

      revertInputValue();
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setOpen, revertInputValue]);

  useEffect(() => {
    const onPointerDownHandler = (e: PointerEvent) => {
      const target = e.target as Node;

      if (elements.floating?.contains(target)) return;
      if (inputGroupElement?.contains(target)) return;

      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDownHandler);

    return () =>
      document.removeEventListener("pointerdown", onPointerDownHandler);
  }, [setOpen, inputGroupElement, elements.floating]);

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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const target = container ?? document.body;

  return createPortal(
    <div
      {...props}
      onPointerDown={onPointerDown}
      ref={setFloating}
      style={{ ...style, ...floatingStyles }}
      className={["bk-combobox-content", className].filter(Boolean).join(" ")}
      role="listbox"
      id={listboxId}
      data-empty={Children.count(children) === 0 ? "" : undefined}
    >
      {children}
    </div>,
    target,
  );
};

export const ComboboxContent = ({
  children,
  ...props
}: ComboboxContentProps) => {
  const { open } = useComboboxContext();

  if (!open) return null;

  return <ComboboxContentInner {...props}>{children}</ComboboxContentInner>;
};

ComboboxContent.displayName = "Combobox.Content";
