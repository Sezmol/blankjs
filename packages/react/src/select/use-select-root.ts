import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useCollection, useControllableState } from "@blankjs/core";

import type { SelectContextValue, UseSelectRootOptions } from "./types";

export const useSelectRoot = (
  options: UseSelectRootOptions = {},
): SelectContextValue => {
  const [value, setValue] = useControllableState({
    prop: options.value,
    defaultProp: options.defaultValue,
    onChange: options.onValueChange,
  });

  const [open, setOpen] = useControllableState({
    prop: options.open,
    defaultProp: options.defaultOpen,
    onChange: options.onOpenChange,
  });

  const { getItems, registerItem } = useCollection<string>();

  const [activeValue, setActiveValue] = useState<string | undefined>(undefined);

  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(
    null,
  );

  const triggerId = useId();
  const listboxId = useId();

  const getOptionId = useCallback(
    (value: string) => `${listboxId}-option-${value}`,
    [listboxId],
  );

  useEffect(() => {
    if (!open) {
      // synchronize the active option with the opening, not with the value
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveValue(undefined);

      return;
    }

    const items = getItems();
    const selectedExists =
      value !== undefined && items.some((item) => item.value === value);

    setActiveValue(selectedExists ? value : items[0]?.value);
    // the effect only reacts to open; value and getItems are read as a snapshot at the time of opening
    // adding them to deps will re-trigger the effect on each selection and break the behavior
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return useMemo<SelectContextValue>(
    () => ({
      open: open ?? false,
      setOpen,

      activeValue,
      setActiveValue,

      value,
      setValue,

      triggerElement,
      setTriggerElement,

      getOptionId,

      listboxId,
      triggerId,

      getItems,
      registerItem,

      disabled: options.disabled ?? false,
    }),
    [
      activeValue,
      getItems,
      getOptionId,
      listboxId,
      open,
      options.disabled,
      registerItem,
      setOpen,
      setValue,
      triggerElement,
      triggerId,
      value,
    ],
  );
};
