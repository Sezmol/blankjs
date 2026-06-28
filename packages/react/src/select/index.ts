import { SelectRoot } from "./root";
import { SelectTrigger } from "./trigger";
import { SelectContent } from "./content";
import { SelectItem } from "./item";
import { SelectValue } from "./value";

export { SelectRoot, SelectTrigger, SelectContent, SelectItem, SelectValue };

export type { SelectTriggerProps } from "./trigger";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Value: SelectValue,
};
