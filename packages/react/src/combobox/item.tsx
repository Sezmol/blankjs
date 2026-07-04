import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type PointerEvent,
} from "react";
import { useComboboxContext } from "./context";

export interface ComboboxItemProps extends ComponentProps<"div"> {
  value: string;
  textValue?: string;
}

const ComboboxCheck = () => (
  <svg
    className="bk-combobox-check"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const ComboboxItem = ({
  value,
  textValue,
  children,
  className,
  ...props
}: ComboboxItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const optionId = useId();

  const {
    value: selectedValue,
    activeItem,
    registerItem,
    commitItem,
    setActiveItem,
  } = useComboboxContext();

  const isSelected = value === selectedValue;

  const isActive = value === activeItem?.value;

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    const unregister = registerItem({
      node,
      value,
      label: textValue ?? node.textContent ?? "",
      id: optionId,
    });

    return () => {
      unregister();
      setActiveItem((prev) => (prev?.value === value ? undefined : prev));
    };
  }, [registerItem, textValue, value, optionId, setActiveItem]);

  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    props.onPointerDown?.(e);

    if (e.defaultPrevented) return;

    e.preventDefault();

    const node = ref.current;

    if (!node) return;

    commitItem({
      id: optionId,
      value,
      label: textValue ?? node.textContent ?? "",
      node,
    });
  };

  return (
    <div
      {...props}
      ref={ref}
      className={["bk-combobox-item", className].filter(Boolean).join(" ")}
      role="option"
      id={optionId}
      aria-selected={isSelected}
      data-active={isActive ? "" : undefined}
      onPointerDown={onPointerDown}
    >
      {children}
      <ComboboxCheck />
    </div>
  );
};

ComboboxItem.displayName = "Combobox.Item";
