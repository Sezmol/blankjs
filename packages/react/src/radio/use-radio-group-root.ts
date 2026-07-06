import { useControllableState } from "@blankjs/core";
import type { RadioGroupContextValue, UseRadioGroupRootOptions } from "./types";
import { useId, useMemo } from "react";

export const useRadioGroupRoot = (
  options: UseRadioGroupRootOptions = {},
): RadioGroupContextValue => {
  const [value, setValue] = useControllableState({
    prop: options.value,
    defaultProp: options.defaultValue,
    onChange: options.onValueChange,
  });

  const fallbackName = useId();

  const name = options.name ?? fallbackName;

  return useMemo(
    () => ({
      value,
      setValue,
      disabled: options.disabled ?? false,
      name,
    }),
    [name, options.disabled, setValue, value],
  );
};
