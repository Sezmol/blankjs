import type { PropsWithChildren } from "react";
import type { UseMultiSelectRootOptions } from "./types";
import { useMultiSelectRoot } from "./use-multi-select-root";
import { MultiSelectContext } from "./context";
import { MultiSelectHiddenInput } from "./hidden-input";

type MultiSelectRootProps = PropsWithChildren<UseMultiSelectRootOptions>;

export const MultiSelectRoot = ({
  children,
  ...options
}: MultiSelectRootProps) => {
  const contextValue = useMultiSelectRoot(options);

  return (
    <MultiSelectContext value={contextValue}>
      {children}
      {options.name && (
        <MultiSelectHiddenInput
          name={options.name}
          defaultValue={options.defaultValue}
        />
      )}
    </MultiSelectContext>
  );
};

MultiSelectRoot.displayName = "MultiSelect.Root";
