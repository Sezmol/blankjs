import { useCallback, useId, useMemo, useRef, useState } from "react";
import {
  useCollection,
  useControllableState,
  type CollectionItem,
} from "@blankjs/core";

import type { SelectContextValue, UseSelectRootOptions } from "./types";

export const useSelectRoot = (
  options: UseSelectRootOptions = {},
): SelectContextValue => {
  const [value, setValue] = useControllableState<string | null>({
    prop: options.value,
    defaultProp: options.defaultValue ?? null,
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

  return useMemo<SelectContextValue>(
    () => ({
      open: open ?? false,
      setOpen,

      activeItem,
      setActiveItem,

      value: value ?? null,
      setValue,

      triggerElement,
      setTriggerElement,
      focusTrigger,

      listboxId,
      triggerId,

      getItems,
      registerItem,

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
      triggerElement,
      triggerId,
      value,
    ],
  );
};
