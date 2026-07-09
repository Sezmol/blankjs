import { SelectRoot } from "./root";
import { SelectTrigger } from "./trigger";
import { SelectContent } from "./content";
import { SelectItem } from "./item";
import { SelectValue } from "./value";
import { SelectClear } from "./clear";

export {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectClear,
};

export type { SelectTriggerProps } from "./trigger";
export type { SelectContentProps } from "./content";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Value: SelectValue,
  Clear: SelectClear,
};
