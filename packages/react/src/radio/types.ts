import type { SetStateFn } from "@blankjs/core";

export interface RadioGroupContextValue {
  value: string | undefined;
  setValue: SetStateFn<string>;
  disabled?: boolean;
  name: string;
}

export type UseRadioGroupRootOptions = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  disabled?: boolean;

  name?: string;
};
