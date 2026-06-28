import { useEffect, useRef, type ComponentProps } from "react";
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

  const {
    value: selectedValue,
    activeValue,
    setValue,
    setOpen,
    registerItem,
    getOptionId,
  } = useSelectContext();

  const isSelected = value === selectedValue;

  const isActive = value === activeValue;

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    return registerItem(node, value, textValue ?? node.textContent ?? "");
  }, [registerItem, textValue, value]);

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
      id={getOptionId(value)}
      aria-selected={isSelected}
      data-active={isActive ? "" : undefined}
      onClick={(e) => {
        props.onClick?.(e);
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
