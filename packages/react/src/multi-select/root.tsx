import type { PropsWithChildren } from "react";
import type { UseMultiSelectRootOptions } from "./types";
import { useMultiSelectRoot } from "./use-multi-select-root";
import { MultiSelectContext } from "./context";
import { MultiSelectHiddenInput } from "./hidden-input";

type MultiSelectRootProps = PropsWithChildren<UseMultiSelectRootOptions>;

export const MultiSelectRoot = ({
  children,
  required,
  ...options
}: MultiSelectRootProps) => {
  const contextValue = useMultiSelectRoot(options);

  return (
    <MultiSelectContext value={contextValue}>
      <div className="bk-multi-select-root">
        {children}
        {options.name && (
          <MultiSelectHiddenInput
            name={options.name}
            defaultValue={options.defaultValue}
            required={required}
          />
        )}
      </div>
    </MultiSelectContext>
  );
};

MultiSelectRoot.displayName = "MultiSelect.Root";
