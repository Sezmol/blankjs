import { useId, useMemo } from "react";
import type { TabsContextValue, UseTabsRootOptions } from "./types";
import { useControllableState } from "@blankjs/core";

export const useTabsRoot = (
  options: UseTabsRootOptions = {},
): TabsContextValue => {
  const [value, setValue] = useControllableState({
    prop: options.value,
    defaultProp: options.defaultValue,
    onChange: options.onValueChange,
  });

  const baseId = useId();

  return useMemo(
    () => ({
      value,
      setValue,
      baseId,
      activationMode: options.activationMode ?? "automatic",
      orientation: options.orientation ?? "horizontal",
      size: options.size ?? "md",
    }),
    [
      baseId,
      options.activationMode,
      options.orientation,
      options.size,
      setValue,
      value,
    ],
  );
};
