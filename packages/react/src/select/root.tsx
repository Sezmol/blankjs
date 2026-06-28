import type { PropsWithChildren } from "react";
import { SelectContext } from "./context";
import type { UseSelectRootOptions } from "./types";
import { useSelectRoot } from "./use-select-root";

type SelectRootProps = PropsWithChildren<UseSelectRootOptions>;

export const SelectRoot = ({ children, ...options }: SelectRootProps) => {
  const contextValue = useSelectRoot(options);

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  );
};

SelectRoot.displayName = "Select.Root";
