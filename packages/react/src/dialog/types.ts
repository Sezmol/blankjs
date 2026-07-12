import type { SetStateFn } from "@blankjs/core";

export interface DialogContextValue {
  open: boolean;
  setOpen: SetStateFn<boolean>;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  registerTitle: () => () => void;
  registerDescription: () => () => void;
}

export type UseDialogRootOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
