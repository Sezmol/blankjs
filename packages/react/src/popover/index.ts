import { PopoverRoot } from "./root";
import { PopoverTrigger } from "./trigger";
import { PopoverContent } from "./content";
import { PopoverClose } from "./close";

export { PopoverRoot, PopoverTrigger, PopoverContent, PopoverClose };

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
};

export type { PopoverCloseProps } from "./close";
export type { PopoverContentProps } from "./content";
export type { PopoverRootProps } from "./root";
export type { PopoverTriggerProps } from "./trigger";
