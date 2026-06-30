import { useCallback, useId, useMemo, useState } from "react";
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
