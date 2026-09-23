import { MenuRoot } from "./root";
import { MenuTrigger } from "./trigger";
import { MenuContent } from "./content";
import { MenuItem } from "./item";

export { MenuRoot, MenuTrigger, MenuContent, MenuItem };

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
};

export type { MenuContentProps } from "./content";
export type { MenuItemProps } from "./item";
export type { MenuRootProps } from "./root";
export type { MenuTriggerProps } from "./trigger";
