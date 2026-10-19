import type { SetStateFn } from "@blankjs/core";

export interface RadioGroupContextValue {
  value: string | null;
  setValue: SetStateFn<string | null>;
  disabled?: boolean;
  required?: boolean;
  name: string;
}

export type UseRadioGroupRootOptions = {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;

  disabled?: boolean;
  required?: boolean;

  name?: string;
};
