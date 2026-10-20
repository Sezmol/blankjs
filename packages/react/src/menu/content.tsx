import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type PointerEvent,
  type ToggleEvent,
} from "react";
import {
  useDeferredOpen,
  useFloatingPosition,
  type Placement,
} from "../internal";
import { useMenuContext } from "./context";
import { composeRefs } from "../slot";

export type MenuContentProps = ComponentProps<"div"> & {
  placement?: Placement;
};

export const MenuContent = ({
  className,
  placement,
  children,
  ref,
  style,
  onToggle,
  onBeforeToggle,
  onKeyDown,
  onPointerLeave,
  ...props
}: MenuContentProps) => {
  const {
    anchor,
    contentId,
    open,
    controlled,
    setOpen,
    shown,
    setShown,
    setContent,
    activeItem,
    setActiveItem,
    getItems,
  } = useMenuContext();

  const innerRef = useRef<HTMLDivElement>(null);
  const [toggles, setToggles] = useState(0);

  const { floatingStyles, setFloating } = useFloatingPosition({
    anchor,
    placement,
  });

  useEffect(() => {
    const content = innerRef.current;

    if (open && content && !content.matches(":popover-open")) {
      content.showPopover({ source: anchor ?? undefined });
    }
  }, [open, anchor]);

  useEffect(() => {
    const content = innerRef.current;

    if (shown && content?.matches(":popover-open")) content.focus();
  }, [shown]);

  useEffect(() => () => setShown(false), [setShown]);

  useEffect(() => {
    const content = innerRef.current;

    if (open || !content?.matches(":popover-open")) return;

    if (content.contains(document.activeElement)) anchor?.focus();

    content.hidePopover();
  }, [open, anchor, toggles]);

  const requestOpen = useDeferredOpen(setOpen);

  const handleBeforeToggle = (e: ToggleEvent<HTMLDivElement>) => {
    onBeforeToggle?.(e);

    if (e.defaultPrevented || e.newState !== "open" || open || !controlled) {
      return;
    }

    e.preventDefault();
    requestOpen();
  };

  const handleToggle = (e: ToggleEvent<HTMLDivElement>) => {
    onToggle?.(e);

    if (e.defaultPrevented) return;

    setShown(e.newState === "open");
    setOpen(e.newState === "open");
    setToggles((count) => count + 1);
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
      onBeforeToggle={handleBeforeToggle}
      onToggle={handleToggle}
      onKeyDown={handleKeyDown}
      onPointerLeave={handlePointerLeave}
      ref={composeRefs<HTMLDivElement>(
        ref,
        innerRef,
        setFloating,
        setContent,
      )}
      style={{ ...style, ...floatingStyles }}
      className={["bk-menu-content", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};
