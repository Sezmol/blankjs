import type { CollectionItem, RegisterItemFn, SetStateFn } from "@blankjs/core";
import type { Dispatch, SetStateAction } from "react";

export interface MultiSelectContextValue {
  open: boolean;
  setOpen: SetStateFn<boolean>;

  value: string[];
  setValue: SetStateFn<string[]>;

  activeItem: CollectionItem<string> | undefined;
  setActiveItem: Dispatch<SetStateAction<CollectionItem<string> | undefined>>;

  triggerElement: HTMLElement | null;
  setTriggerElement: (node: HTMLElement | null) => void;

  triggerId: string;
  listboxId: string;

  registerItem: RegisterItemFn<string>;
  getItems: () => CollectionItem<string>[];

  toggleValue: (value: string) => void;

  disabled: boolean;
}

export type UseMultiSelectRootOptions = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  disabled?: boolean;

  name?: string;
};
