import type { ComponentProps, MouseEvent } from "react";
import { useSelectContext } from "./context";

const SelectClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export type SelectClearProps = ComponentProps<"button">;

export const SelectClear = ({
  className,
  children,
  onClick,
  ...props
}: SelectClearProps) => {
  const { value, setValue, disabled, triggerElement } = useSelectContext();

  if (!value || disabled) return null;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    setValue(undefined);

    triggerElement?.focus();
  };

  return (
    <button
      type="button"
      aria-label="Clear"
      className={["bk-select-clear", className].filter(Boolean).join(" ")}
      onClick={handleClick}
      {...props}
    >
      {children ?? <SelectClearIcon />}
    </button>
  );
};

SelectClear.displayName = "Select.Clear";
