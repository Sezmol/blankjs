import type { PropsWithChildren } from "react";
import type { UseComboboxRootOptions } from "./types";
import { useComboboxRoot } from "./use-combobox-root";
import { ComboboxHiddenInput } from "./hidden-input";
import { ComboboxContext } from "./context";

type ComboboxRootProps = PropsWithChildren<UseComboboxRootOptions>;

export const ComboboxRoot = ({
  children,
  required,
  ...options
}: ComboboxRootProps) => {
  const contextValue = useComboboxRoot(options);

  return (
    <ComboboxContext value={contextValue}>
      <div className="bk-combobox-root" data-size={contextValue.size}>
        {children}

        {options.name && (
          <ComboboxHiddenInput name={options.name} required={required} />
        )}
      </div>
    </ComboboxContext>
  );
};

ComboboxRoot.displayName = "Combobox.Root";
