import { useControllableState } from "@blankjs/core";
import { useCallback } from "react";
import type { UseCheckboxGroupRootOptions } from "./types";

const EMPTY: string[] = [];

export const useCheckboxGroupRoot = (
  options: Pick<
    UseCheckboxGroupRootOptions,
    "value" | "defaultValue" | "onValueChange"
  >,
) => {
  const [value, setValue] = useControllableState<string[]>({
    prop: options.value,
    defaultProp: options.defaultValue ?? EMPTY,
    onChange: options.onValueChange,
  });

  const toggle = useCallback(
    (item: string, checked: boolean) =>
      setValue((prev = EMPTY) => {
        if (prev.includes(item) === checked) return prev;

        return checked ? [...prev, item] : prev.filter((v) => v !== item);
      }),
    [setValue],
  );

  return { value: value ?? EMPTY, setValue, toggle };
};
