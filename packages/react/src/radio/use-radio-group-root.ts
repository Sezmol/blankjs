import { useControllableState } from "@blankjs/core";
import type { RadioGroupContextValue, UseRadioGroupRootOptions } from "./types";
import { useId, useMemo } from "react";

export const useRadioGroupRoot = (
  options: UseRadioGroupRootOptions = {},
): RadioGroupContextValue => {
  const [value, setValue] = useControllableState<string | null>({
    prop: options.value,
    defaultProp: options.defaultValue ?? null,
    onChange: options.onValueChange,
  });

  const fallbackName = useId();

  const name = options.name ?? fallbackName;

  return useMemo(
    () => ({
      value: value ?? null,
      setValue,
      disabled: options.disabled ?? false,
      required: options.required ?? false,
      name,
    }),
    [name, options.disabled, options.required, setValue, value],
  );
};
