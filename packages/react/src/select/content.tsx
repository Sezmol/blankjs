import { useCallback, type ComponentProps } from "react";
import { createPortal } from "react-dom";

import { useSelectContext } from "./context";
import {
  useInitialActiveItem,
  usePopover,
  type UsePopoverOptions,
} from "../internal";

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

  const onDismiss: UsePopoverOptions["onDismiss"] = useCallback(
    () => setOpen(false),
    [setOpen],
  );

  const { setFloating, floatingStyles } = usePopover({
    anchor: triggerElement,
    onDismiss,
    matchWidth: "exact",
  });

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
