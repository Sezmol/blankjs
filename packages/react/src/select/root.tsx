import type { PropsWithChildren } from "react";
import { SelectContext } from "./context";
import { SelectHiddenInput } from "./hidden-input";
import type { UseSelectRootOptions } from "./types";
import { useSelectRoot } from "./use-select-root";

type SelectRootProps = PropsWithChildren<UseSelectRootOptions>;

export const SelectRoot = ({
  children,
  required,
  ...options
}: SelectRootProps) => {
  const contextValue = useSelectRoot(options);

  return (
    <SelectContext value={contextValue}>
      <div className="bk-select-root">
        {children}
        {options.name && (
          <SelectHiddenInput
            name={options.name}
            defaultValue={options.defaultValue}
            required={required}
          />
        )}
      </div>
    </SelectContext>
  );
};

SelectRoot.displayName = "Select.Root";
