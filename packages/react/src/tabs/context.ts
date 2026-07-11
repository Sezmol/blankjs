import { createContext, useContext } from "react";
import type { TabsContextValue } from "./types";

export const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabsContext = () => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("[blankjs] Tabs.* must be used within Tabs.Root");
  }

  return context;
};
