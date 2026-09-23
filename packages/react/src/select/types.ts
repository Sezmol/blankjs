import type { CollectionItem, RegisterItemFn, SetStateFn } from "@blankjs/core";
import type { Dispatch, SetStateAction } from "react";
import type { Size } from "../types";

export interface SelectContextValue {
  open: boolean;
  setOpen: SetStateFn<boolean>;

  value: string | null;
  setValue: SetStateFn<string | null>;

  activeItem: CollectionItem<string> | undefined;
  setActiveItem: Dispatch<SetStateAction<CollectionItem<string> | undefined>>;

  triggerElement: HTMLElement | null;
  setTriggerElement: (node: HTMLElement | null) => void;

  triggerId: string;
  listboxId: string;

  registerItem: RegisterItemFn<string>;
  getItems: () => CollectionItem<string>[];

  disabled: boolean;

  size: Size;
}

export type UseSelectRootOptions = {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  disabled?: boolean;
  required?: boolean;

  name?: string;

  size?: Size;
};
