import {
  useCollection,
  useControllableState,
  type CollectionItem,
} from "@blankjs/core";
import type { ComboboxContextValue, UseComboboxRootOptions } from "./types";
import { useCallback, useId, useMemo, useRef, useState } from "react";

export const useComboboxRoot = (
  options: UseComboboxRootOptions = {},
): ComboboxContextValue => {
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

  const [inputValue, setInputValue] = useControllableState({
    prop: options.inputValue,
    defaultProp: options.defaultInputValue ?? "",
    onChange: options.onInputValueChange,
  });

  const committedLabelRef = useRef(options.defaultInputValue ?? "");

  const { getItems, registerItem } = useCollection<string>();

  const [activeItem, setActiveItem] = useState<
    CollectionItem<string> | undefined
  >();

  const [inputGroupElement, setInputGroupElement] =
    useState<HTMLElement | null>(null);

  const inputId = useId();
  const listboxId = useId();

  const revertInputValue = useCallback(() => {
    setInputValue(committedLabelRef.current);
  }, [setInputValue]);

  const commitItem = useCallback(
    (item: CollectionItem<string>) => {
      setValue(item.value);
      setInputValue(item.label);
      setOpen(false);

      committedLabelRef.current = item.label;
    },
    [setInputValue, setOpen, setValue],
  );

  const resetToDefault = useCallback(() => {
    const defaultInputValue = options.defaultInputValue ?? "";

    setInputValue(defaultInputValue);
    setValue(options.defaultValue);
    setOpen(false);

    committedLabelRef.current = defaultInputValue;
  }, [
    options.defaultInputValue,
    options.defaultValue,
    setInputValue,
    setOpen,
    setValue,
  ]);

  const clear = useCallback(() => {
    setValue(undefined);
    setInputValue("");
    committedLabelRef.current = "";
  }, [setInputValue, setValue]);

  return useMemo(
    () => ({
      open: open ?? false,
      setOpen,

      value,
      setValue,

      inputValue: inputValue ?? "",
      setInputValue,

      activeItem,
      setActiveItem,

      commitItem,

      registerItem,
      getItems,

      inputGroupElement,
      setInputGroupElement,

      inputId,
      listboxId,

      disabled: options.disabled ?? false,

      revertInputValue,

      resetToDefault,

      clear,

      size: options.size ?? "md",
    }),
    [
      activeItem,
      clear,
      options.size,
      commitItem,
      getItems,
      inputGroupElement,
      inputId,
      inputValue,
      listboxId,
      open,
      options.disabled,
      registerItem,
      resetToDefault,
      revertInputValue,
      setInputValue,
      setOpen,
      setValue,
      value,
    ],
  );
};
