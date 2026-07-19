import { useFieldControlProps } from "@blankjs/core";
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { useMultiSelectContext } from "./context";
import { composeRefs, Slot } from "../slot";
import { useListboxKeyboard } from "../internal";

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
  const { required: _required, ...fieldProps } = useFieldControlProps();

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

  // explicit prop wins; the two contexts (field, root) OR together
  const isDisabled = props.disabled ?? (fieldProps.disabled || disabled);
  const id = props.id ?? fieldProps.id ?? triggerId;

  const activeDescendant = open ? activeItem?.id : undefined;

  const onListboxKeyDown = useListboxKeyboard({
    activeItem,
    setActiveItem,
    getItems,
    open,
    setOpen,
    onCommit: (item) => toggleValue(item.value),
  });

  const triggerProps: ComponentProps<"button"> = {
    type: "button" as const,
    ...fieldProps,
    ...props,
    className: ["bk-multi-select-trigger", className].filter(Boolean).join(" "),
    id,
    role: "combobox",
    "aria-disabled": isDisabled || undefined,
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    "aria-controls": open ? listboxId : undefined,
    "aria-activedescendant": activeDescendant,
    disabled: isDisabled,
    onKeyDown: (e) => {
      if (isDisabled) return;

      props.onKeyDown?.(e);
      onListboxKeyDown(e);
    },
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
