import { useCallback, useId, useMemo, useRef, useState } from "react";
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

  const triggerRef = useRef<HTMLElement | null>(null);

  const [triggerElement, setTriggerState] = useState<HTMLElement | null>(
    null,
  );

  const setTriggerElement = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
    setTriggerState(node);
  }, []);

  const focusTrigger = useCallback(() => triggerRef.current?.focus(), []);

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
      focusTrigger,

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
      focusTrigger,
      getItems,
      listboxId,
      open,
      options.disabled,
      options.size,
      registerItem,
      setOpen,
      setTriggerElement,
      setValue,
      toggleValue,
      triggerElement,
      triggerId,
      value,
    ],
  );
};
