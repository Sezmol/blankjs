import { DialogRoot } from "./root";
import { DialogTrigger } from "./trigger";
import { DialogContent } from "./content";
import { DialogClose } from "./close";
import { DialogTitle } from "./title";
import { DialogDescription } from "./description";

export {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
};

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Close: DialogClose,
  Title: DialogTitle,
  Description: DialogDescription,
};

export type { DialogCloseProps } from "./close";
export type { DialogContentProps } from "./content";
export type { DialogDescriptionProps } from "./description";
export type { DialogRootProps } from "./root";
export type { DialogTitleProps } from "./title";
export type { DialogTriggerProps } from "./trigger";
