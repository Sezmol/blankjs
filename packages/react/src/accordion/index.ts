import { AccordionRoot } from "./root";
import { AccordionItem } from "./item";
import { AccordionTrigger } from "./trigger";
import { AccordionContent } from "./content";

export { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent };

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};

export type { AccordionContentProps } from "./content";
export type { AccordionItemProps } from "./item";
export type { AccordionRootProps } from "./root";
export type { AccordionTriggerProps } from "./trigger";
