import type { PropsWithChildren } from "react";
import type { UseComboboxRootOptions } from "./types";
import { useComboboxRoot } from "./use-combobox-root";
import { ComboboxHiddenInput } from "./hidden-input";
import { ComboboxContext } from "./context";

type ComboboxRootProps = PropsWithChildren<UseComboboxRootOptions>;

export const ComboboxRoot = ({ children, ...options }: ComboboxRootProps) => {
  const contextValue = useComboboxRoot(options);

  return (
    <ComboboxContext value={contextValue}>
      {children}

      {options.name && <ComboboxHiddenInput name={options.name} />}
    </ComboboxContext>
  );
};

ComboboxRoot.displayName = "Combobox.Root";
