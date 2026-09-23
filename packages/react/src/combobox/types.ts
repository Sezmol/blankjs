import type { CollectionItem, RegisterItemFn, SetStateFn } from "@blankjs/core";
import type { Dispatch, SetStateAction } from "react";
import type { Size } from "../types";

export interface ComboboxContextValue {
  open: boolean;
  setOpen: SetStateFn<boolean>;

  value: string | null;
  setValue: SetStateFn<string | null>;

  inputValue: string;
  setInputValue: SetStateFn<string>;

  activeItem: CollectionItem<string> | undefined;
  setActiveItem: Dispatch<SetStateAction<CollectionItem<string> | undefined>>;

  commitItem: (item: CollectionItem<string>) => void;

  registerItem: RegisterItemFn<string>;
  getItems: () => CollectionItem<string>[];

  inputGroupElement: HTMLElement | null;
  setInputGroupElement: (node: HTMLElement | null) => void;

  inputId: string;
  listboxId: string;

  disabled: boolean;

  revertInputValue: () => void;

  resetToDefault: () => void;

  clear: () => void;

  size: Size;
}

export type UseComboboxRootOptions = {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;

  disabled?: boolean;
  required?: boolean;

  name?: string;

  size?: Size;
};
