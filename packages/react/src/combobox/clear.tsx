import type { ComponentProps, MouseEvent } from "react";
import { useComboboxContext } from "./context";

const ComboboxClearIcon = () => (
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

export type ComboboxClearProps = ComponentProps<"button">;

export const ComboboxClear = ({
  children,
  className,
  onClick,
  ...props
}: ComboboxClearProps) => {
  const { value, disabled, clear, inputGroupElement } = useComboboxContext();

  if (!value || disabled) return null;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    clear();
    inputGroupElement?.querySelector("input")?.focus();
  };

  return (
    <button
      type="button"
      aria-label="Clear"
      className={["bk-combobox-clear", className].filter(Boolean).join(" ")}
      onClick={handleClick}
      {...props}
    >
      {children ?? <ComboboxClearIcon />}
    </button>
  );
};

ComboboxClear.displayName = "Combobox.Clear";
