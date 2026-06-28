import { useEffect, type ComponentProps } from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { useSelectContext } from "./context";

type SelectContentProps = ComponentProps<"div">;

const SelectContentInner = ({
  children,
  style,
  className,
  ...props
}: SelectContentProps) => {
  const { triggerElement, listboxId, setOpen } = useSelectContext();

  const { refs, floatingStyles, elements } = useFloating({
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    elements: { reference: triggerElement },
  });

  const { setFloating } = refs;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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

  return (
    <div
      {...props}
      ref={setFloating}
      style={{ ...style, ...floatingStyles }}
      className={["bk-select-content", className].filter(Boolean).join(" ")}
      role="listbox"
      id={listboxId}
    >
      {children}
    </div>
  );
};

export const SelectContent = ({ children, ...props }: SelectContentProps) => {
  const { open } = useSelectContext();

  if (!open) return null;

  return <SelectContentInner {...props}>{children}</SelectContentInner>;
};

SelectContent.displayName = "Select.Content";
