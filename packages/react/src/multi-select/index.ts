import { MultiSelectRoot } from "./root";
import { MultiSelectTrigger } from "./trigger";
import { MultiSelectContent } from "./content";
import { MultiSelectItem } from "./item";
import { MultiSelectValue } from "./value";
import { MultiSelectClear } from "./clear";

export {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectValue,
  MultiSelectClear,
};

export type { MultiSelectTriggerProps } from "./trigger";
export type { MultiSelectContentProps } from "./content";
export type { MultiSelectItemProps } from "./item";
export type { MultiSelectValueProps } from "./value";

export const MultiSelect = {
  Root: MultiSelectRoot,
  Trigger: MultiSelectTrigger,
  Content: MultiSelectContent,
  Item: MultiSelectItem,
  Value: MultiSelectValue,
  Clear: MultiSelectClear,
};
