import { useCallback, type ComponentProps } from "react";
import { createPortal } from "react-dom";

import { useMultiSelectContext } from "./context";
import {
  useInitialActiveItem,
  usePopover,
  type UsePopoverOptions,
} from "../internal";

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
  const {
    triggerElement,
    listboxId,
    setOpen,
    getItems,
    value,
    setActiveItem,
    size,
  } = useMultiSelectContext();

  const onDismiss: UsePopoverOptions["onDismiss"] = useCallback(
    () => setOpen(false),
    [setOpen],
  );

  const { setFloating, floatingStyles } = usePopover({
    anchor: triggerElement,
    onDismiss,
  });

  const mounted = useInitialActiveItem({
    getItems,
    setActiveItem,
    isSelected: (item) => value.includes(item.value),
  });

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
      data-size={size}
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
