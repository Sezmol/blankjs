import {
  Children,
  useCallback,
  type ComponentProps,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

import { useComboboxContext } from "./context";
import {
  useInitialActiveItem,
  usePopover,
  type UsePopoverOptions,
} from "../internal";

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

  const onDismiss: UsePopoverOptions["onDismiss"] = useCallback(
    (reason) => {
      if (reason === "escape") {
        revertInputValue();
      }

      setOpen(false);
    },
    [revertInputValue, setOpen],
  );

  const { setFloating, floatingStyles } = usePopover({
    anchor: inputGroupElement,
    onDismiss,
    matchWidth: "min",
  });

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    props.onPointerDown?.(e);

    if (e.defaultPrevented) return;

    e.preventDefault();
  };

  const mounted = useInitialActiveItem({
    getItems,
    setActiveItem,
    isSelected: (item) => item.value === value,
  });

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
