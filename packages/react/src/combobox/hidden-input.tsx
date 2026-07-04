import { useEffect, useRef } from "react";
import { useComboboxContext } from "./context";

export interface ComboboxHiddenInputProps {
  name: string;
}

export const ComboboxHiddenInput = ({ name }: ComboboxHiddenInputProps) => {
  const { value, resetToDefault, disabled } = useComboboxContext();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = ref.current?.form;

    if (!form) return;

    form.addEventListener("reset", resetToDefault);

    return () => form.removeEventListener("reset", resetToDefault);
  }, [resetToDefault]);

  return (
    <input
      ref={ref}
      type="hidden"
      name={name}
      value={value ?? ""}
      disabled={disabled}
      readOnly
    />
  );
};

ComboboxHiddenInput.displayName = "Combobox.HiddenInput";
