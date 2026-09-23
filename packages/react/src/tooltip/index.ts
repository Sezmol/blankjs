import { TooltipRoot } from "./root";
import { TooltipTrigger } from "./trigger";
import { TooltipContent } from "./content";

export { TooltipRoot, TooltipTrigger, TooltipContent };

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};

export type { TooltipContentProps } from "./content";
export type { TooltipRootProps } from "./root";
export type { TooltipTriggerProps } from "./trigger";
