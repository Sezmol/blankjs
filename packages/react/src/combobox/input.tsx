import type {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { useComboboxContext } from "./context";
import { useFieldControlProps } from "@blankjs/core";

const ComboboxArrow = () => (
  <svg
    className="bk-combobox-arrow"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export type ComboboxInputProps = Omit<
  ComponentProps<"input">,
  "value" | "defaultValue"
>;

export const ComboboxInput = ({ className, ...props }: ComboboxInputProps) => {
  const {
    inputId,
    disabled,
    open,
    activeItem,
    inputValue,
    listboxId,
    setInputValue,
    setInputGroupElement,
    getItems,
    setActiveItem,
    setOpen,
    commitItem,
    revertInputValue,
  } = useComboboxContext();
  const { required: _required, ...fieldProps } = useFieldControlProps();

  const id = fieldProps.id ?? inputId;
  const isDisabled = fieldProps.disabled || props.disabled || disabled;

  const activeDescendant = open ? activeItem?.id : undefined;

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    props.onBlur?.(e);

    if (e.defaultPrevented) return;

    revertInputValue();

    setOpen(false);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    props.onChange?.(e);

    if (e.defaultPrevented) return;

    setInputValue(e.target.value);

    setOpen(true);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    props.onKeyDown?.(e);

    if (e.defaultPrevented) return;

    const key = e.key;

    if (!open) {
      switch (key) {
        case "ArrowDown":
        case "ArrowUp": {
          e.preventDefault();
          setOpen(true);

          break;
        }

        default:
          break;
      }

      return;
    }

    const items = getItems();
    const index = items.findIndex((item) => item.value === activeItem?.value);

    switch (key) {
      case "ArrowDown": {
        e.preventDefault();

        const next = items[Math.min(index + 1, items.length - 1)];

        if (next) {
          setActiveItem(next);
        }

        break;
      }

      case "ArrowUp": {
        e.preventDefault();

        const prev = items[Math.max(index - 1, 0)];

        if (prev) {
          setActiveItem(prev);
        }

        break;
      }

      case "Enter": {
        e.preventDefault();

        if (activeItem) {
          commitItem(activeItem);
        }

        break;
      }

      case "Tab":
        setOpen(false);

        break;

      default:
        break;
    }
  };

  const onClick = (e: MouseEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    props.onClick?.(e);

    if (e.defaultPrevented) return;

    setOpen(true);
  };

  return (
    <div className="bk-combobox-group" ref={setInputGroupElement}>
      <input
        {...props}
        {...fieldProps}
        value={inputValue}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={onBlur}
        className={["bk-combobox-input", className].filter(Boolean).join(" ")}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={activeDescendant}
        disabled={isDisabled}
        id={id}
      />
      <ComboboxArrow />
    </div>
  );
};

ComboboxInput.displayName = "Combobox.Input";
