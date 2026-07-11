import type { SetStateFn } from "@blankjs/core";
import type { Size } from "../types";

export interface TabsContextValue {
  value: string | undefined;
  setValue: SetStateFn<string>;
  baseId: string;
  activationMode: "automatic" | "manual";
  orientation: "horizontal" | "vertical";
  size: Size;
}

export type UseTabsRootOptions = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  activationMode?: "automatic" | "manual";
  orientation?: "horizontal" | "vertical";
  size?: Size;
};
