import type { PropsWithChildren } from "react";
import { TabsContext } from "./context";
import type { UseTabsRootOptions } from "./types";
import { useTabsRoot } from "./use-tabs-root";

type TabsRootProps = PropsWithChildren<UseTabsRootOptions>;

export const TabsRoot = ({ children, ...options }: TabsRootProps) => {
  const contextValue = useTabsRoot(options);

  return (
    <TabsContext value={contextValue}>
      <div
        className="bk-tabs-root"
        data-size={contextValue.size}
        data-orientation={contextValue.orientation}
      >
        {children}
      </div>
    </TabsContext>
  );
};

TabsRoot.displayName = "Tabs.Root";
