import { useCallback, useId, useMemo, useState } from "react";
import {
  useCollection,
  useControllableState,
  type CollectionItem,
} from "@blankjs/core";

import type {
  MultiSelectContextValue,
  UseMultiSelectRootOptions,
} from "./types";

export const useMultiSelectRoot = (
  options: UseMultiSelectRootOptions = {},
): MultiSelectContextValue => {
  const [value, setValue] = useControllableState({
    prop: options.value,
    defaultProp: options.defaultValue ?? [],
    onChange: options.onValueChange,
  });

  const [open, setOpen] = useControllableState({
    prop: options.open,
    defaultProp: options.defaultOpen,
    onChange: options.onOpenChange,
  });

  const { getItems, registerItem } = useCollection<string>();

  const [activeItem, setActiveItem] = useState<
    CollectionItem<string> | undefined
  >(undefined);

  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(
    null,
  );

  const triggerId = useId();
  const listboxId = useId();

  const toggleValue = useCallback(
    (v: string) =>
      setValue((prev = []) =>
        prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
      ),
    [setValue],
  );

  return useMemo<MultiSelectContextValue>(
    () => ({
      open: open ?? false,
      setOpen,

      activeItem,
      setActiveItem,

      value: value ?? [],
      setValue,

      triggerElement,
      setTriggerElement,

      listboxId,
      triggerId,

      getItems,
      registerItem,

      toggleValue,

      disabled: options.disabled ?? false,

      size: options.size ?? "md",
    }),
    [
      activeItem,
      getItems,
      listboxId,
      open,
      options.disabled,
      options.size,
      registerItem,
      setOpen,
      setValue,
      toggleValue,
      triggerElement,
      triggerId,
      value,
    ],
  );
};
