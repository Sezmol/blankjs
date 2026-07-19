import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { composeRefs } from "../slot";
import { useMenuContext } from "./context";

type MenuItemProps = ComponentProps<"div"> & {
  disabled?: boolean;
};

export const MenuItem = ({
  disabled,
  children,
  className,
  ref,
  onClick,
  onPointerEnter,
  ...props
}: MenuItemProps) => {
  const { registerItem, activeItem, setActiveItem, setOpen } = useMenuContext();

  const id = useId();
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = innerRef.current;

    if (!node || disabled) return;

    return registerItem({
      node,
      id,
      value: id,
      label: node.textContent ?? "",
    });
  }, [registerItem, id, disabled]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    onClick?.(e);

    if (e.defaultPrevented) return;

    setOpen(false);
  };

  const handlePointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    onPointerEnter?.(e);

    if (e.defaultPrevented || disabled) return;

    setActiveItem({
      node: e.currentTarget,
      id,
      value: id,
      label: e.currentTarget.textContent ?? "",
    });
  };

  return (
    <div
      {...props}
      id={id}
      role="menuitem"
      aria-disabled={disabled || undefined}
      data-active={activeItem?.id === id || undefined}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      ref={composeRefs<HTMLDivElement>(ref, innerRef)}
      className={["bk-menu-item", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};
