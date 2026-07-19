import {
  useEffect,
  useRef,
  type ComponentProps,
  type KeyboardEvent,
  type PointerEvent,
  type ToggleEvent,
} from "react";
import { useFloatingPosition, type Placement } from "../internal";
import { useMenuContext } from "./context";
import { composeRefs } from "../slot";

type MenuContentProps = ComponentProps<"div"> & {
  placement?: Placement;
};

export const MenuContent = ({
  className,
  placement,
  children,
  ref,
  style,
  onToggle,
  onKeyDown,
  onPointerLeave,
  ...props
}: MenuContentProps) => {
  const {
    anchor,
    contentId,
    open,
    setOpen,
    activeItem,
    setActiveItem,
    getItems,
  } = useMenuContext();

  const innerRef = useRef<HTMLDivElement>(null);

  const { floatingStyles, setFloating } = useFloatingPosition({
    anchor,
    placement,
  });

  useEffect(() => {
    const content = innerRef.current;

    if (!content) return;

    const shown = content.matches(":popover-open");

    if (open) {
      if (!shown) content.showPopover();

      content.focus();
    } else if (shown) {
      if (content.contains(document.activeElement)) anchor?.focus();

      content.hidePopover();
    }
  }, [open, anchor]);

  const handleToggle = (e: ToggleEvent<HTMLDivElement>) => {
    onToggle?.(e);

    if (e.defaultPrevented) return;

    setOpen(e.newState === "open");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);

    if (e.defaultPrevented) return;

    const items = getItems();
    const index = items.findIndex((item) => item.id === activeItem?.id);

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setActiveItem(items[Math.min(index + 1, items.length - 1)]);

        break;
      }

      case "ArrowUp": {
        e.preventDefault();
        setActiveItem(index === -1 ? items[items.length - 1] : items[Math.max(index - 1, 0)]);

        break;
      }

      case "Home": {
        e.preventDefault();
        setActiveItem(items[0]);

        break;
      }

      case "End": {
        e.preventDefault();
        setActiveItem(items[items.length - 1]);

        break;
      }

      case "Enter":
      case " ": {
        e.preventDefault();
        activeItem?.node.click();

        break;
      }

      case "Tab": {
        setOpen(false);

        break;
      }

      default:
        break;
    }
  };

  const handlePointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);

    if (e.defaultPrevented) return;

    setActiveItem(undefined);
  };

  return (
    <div
      {...props}
      id={contentId}
      role="menu"
      popover="auto"
      tabIndex={-1}
      aria-activedescendant={activeItem?.id}
      onToggle={handleToggle}
      onKeyDown={handleKeyDown}
      onPointerLeave={handlePointerLeave}
      ref={composeRefs<HTMLDivElement>(ref, innerRef, setFloating)}
      style={{ ...style, ...floatingStyles }}
      className={["bk-menu-content", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};
