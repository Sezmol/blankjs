import { useId, useMemo, useState } from "react";
import {
  useCollection,
  useControllableState,
  type CollectionItem,
} from "@blankjs/core";

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

  const [activeItem, setActiveItem] = useState<
    CollectionItem<string> | undefined
  >(undefined);

  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(
    null,
  );

  const triggerId = useId();
  const listboxId = useId();

  return useMemo<SelectContextValue>(
    () => ({
      open: open ?? false,
      setOpen,

      activeItem,
      setActiveItem,

      value,
      setValue,

      triggerElement,
      setTriggerElement,

      listboxId,
      triggerId,

      getItems,
      registerItem,

      disabled: options.disabled ?? false,
    }),
    [
      activeItem,
      getItems,
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
