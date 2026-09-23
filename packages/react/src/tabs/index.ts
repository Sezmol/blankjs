import { TabsRoot } from "./root";
import { TabsList } from "./list";
import { TabsPanel } from "./panel";
import { Tab } from "./tab";

export { TabsRoot, TabsList, TabsPanel, Tab };

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Panel: TabsPanel,
  Tab: Tab,
};

export type { TabsListProps } from "./list";
export type { TabsPanelProps } from "./panel";
export type { TabsRootProps } from "./root";
export type { TabProps } from "./tab";
