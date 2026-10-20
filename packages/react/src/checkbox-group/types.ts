import type { Size } from "../types";

export interface CheckboxGroupContextValue {
  value: string[];
  toggle: (value: string, checked: boolean) => void;
  sync: () => void;
  disabled: boolean;
  name?: string;
  size: Size;
}

export type UseCheckboxGroupRootOptions = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;

  disabled?: boolean;
  required?: boolean;

  name?: string;
};
