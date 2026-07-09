import type { CollectionItem, RegisterItemFn, SetStateFn } from "@blankjs/core";
import type { Dispatch, SetStateAction } from "react";

export interface ComboboxContextValue {
  open: boolean;
  setOpen: SetStateFn<boolean>;

  value: string | undefined;
  setValue: SetStateFn<string>;

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
}

export type UseComboboxRootOptions = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;

  disabled?: boolean;

  name?: string;
};
