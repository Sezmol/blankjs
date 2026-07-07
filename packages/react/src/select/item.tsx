import { useEffect, useId, useRef, type ComponentProps } from "react";
import { useSelectContext } from "./context";

export interface SelectItemProps extends ComponentProps<"div"> {
  value: string;
  textValue?: string;
}

const SelectCheck = () => (
  <svg
    className="bk-select-check"
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

export const SelectItem = ({
  value,
  textValue,
  children,
  className,
  ...props
}: SelectItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const optionId = useId();

  const {
    value: selectedValue,
    activeItem,
    setValue,
    setOpen,
    registerItem,
    setActiveItem,
  } = useSelectContext();

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

  return (
    <div
      {...props}
      ref={ref}
      className={["bk-select-item", className].filter(Boolean).join(" ")}
      role="option"
      id={optionId}
      aria-selected={isSelected}
      data-active={isActive ? "" : undefined}
      onClick={(e) => {
        props.onClick?.(e);

        if (e.defaultPrevented) return;

        setValue(value);
        setOpen(false);
      }}
    >
      {children}
      <SelectCheck />
    </div>
  );
};

SelectItem.displayName = "Select.Item";
