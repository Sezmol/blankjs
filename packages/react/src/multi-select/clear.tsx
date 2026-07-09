import type { ComponentProps, MouseEvent } from "react";
import { useMultiSelectContext } from "./context";

const MultiSelectClearIcon = () => (
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

export type MultiSelectClearProps = ComponentProps<"button">;

export const MultiSelectClear = ({
  className,
  children,
  onClick,
  ...props
}: MultiSelectClearProps) => {
  const { value, setValue, disabled, triggerElement } =
    useMultiSelectContext();

  if (!value.length || disabled) return null;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    setValue([]);

    triggerElement?.focus();
  };

  return (
    <button
      type="button"
      aria-label="Clear"
      className={["bk-multi-select-clear", className].filter(Boolean).join(" ")}
      onClick={handleClick}
      {...props}
    >
      {children ?? <MultiSelectClearIcon />}
    </button>
  );
};

MultiSelectClear.displayName = "MultiSelect.Clear";
