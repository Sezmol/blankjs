import { useFieldControlProps } from "@blankjs/core";
import {
  useRef,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { useMultiSelectContext } from "./context";
import { composeRefs, Slot } from "../slot";

export interface MultiSelectTriggerProps extends ComponentProps<"button"> {
  children: ReactNode;
  asChild?: boolean;
}

const MultiSelectArrow = () => (
  <svg
    className="bk-multi-select-arrow"
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

export const MultiSelectTrigger = ({
  asChild,
  children,
  className,
  ...props
}: MultiSelectTriggerProps) => {
  const searchRef = useRef("");
  const timerRef = useRef<number | null>(null);

  const fieldProps = useFieldControlProps();

  const {
    open,
    setOpen,
    triggerId,
    listboxId,
    disabled,
    activeItem,
    setTriggerElement,
    getItems,
    setActiveItem,
    toggleValue,
  } = useMultiSelectContext();

  const isDisabled = fieldProps.disabled || disabled;
  const id = fieldProps.id ?? triggerId;

  const activeDescendant = open ? activeItem?.id : undefined;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    props.onKeyDown?.(e);

    const key = e.key;

    if (!open) {
      switch (key) {
        case "ArrowDown":
        case "ArrowUp":
        case "Enter":
        case " ": {
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

    const isPrintable =
      key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    const isSpaceSelect = key === " " && searchRef.current === "";

    if (isPrintable && !isSpaceSelect) {
      e.preventDefault();

      searchRef.current += key;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        searchRef.current = "";
      }, 500);

      const query = searchRef.current.toLowerCase();

      for (let offset = 1; offset <= items.length; offset++) {
        const i = (index + offset) % items.length;
        const item = items[i];

        if (item && item.label.toLowerCase().startsWith(query)) {
          setActiveItem(item);

          break;
        }
      }

      return;
    }

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

      case "Enter":
      case " ": {
        e.preventDefault();

        if (activeItem && searchRef.current === "") {
          toggleValue(activeItem.value);
        }

        break;
      }

      case "Tab":
        setOpen(false);
        break;

      case "Home":
        e.preventDefault();

        setActiveItem(items[0]);

        break;

      case "End":
        e.preventDefault();

        setActiveItem(items[items.length - 1]);

        break;

      default:
        break;
    }
  };

  const triggerProps: ComponentProps<"button"> = {
    type: "button" as const,
    ...props,
    ...fieldProps,
    className: ["bk-multi-select-trigger", className].filter(Boolean).join(" "),
    id,
    role: "combobox",
    "aria-disabled": isDisabled || undefined,
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    "aria-controls": open ? listboxId : undefined,
    "aria-activedescendant": activeDescendant,
    disabled: isDisabled,
    onKeyDown,
    onClick: (e) => {
      if (isDisabled) return;

      props.onClick?.(e);
      setOpen((o) => !o);
    },
  };

  if (asChild) {
    return (
      <Slot
        {...triggerProps}
        ref={composeRefs<HTMLButtonElement>(setTriggerElement, props.ref)}
      >
        {children as ReactElement}
      </Slot>
    );
  }

  return (
    <button
      {...triggerProps}
      ref={composeRefs<HTMLButtonElement>(setTriggerElement, props.ref)}
    >
      {children}
      <MultiSelectArrow />
    </button>
  );
};

MultiSelectTrigger.displayName = "MultiSelect.Trigger";
