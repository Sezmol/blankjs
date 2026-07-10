import { useEffect, useRef } from "react";
import { useComboboxContext } from "./context";
import { useFieldControlProps } from "@blankjs/core";

export interface ComboboxHiddenInputProps {
  name: string;
  required?: boolean;
}

export const ComboboxHiddenInput = ({
  name,
  required,
}: ComboboxHiddenInputProps) => {
  const { value, resetToDefault, disabled, inputGroupElement } =
    useComboboxContext();
  const ref = useRef<HTMLInputElement>(null);

  const controlProps = useFieldControlProps();
  const isRequired = required ?? controlProps.required ?? false;

  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;

      return;
    }

    ref.current?.dispatchEvent(new Event("change", { bubbles: true }));
  }, [value]);

  useEffect(() => {
    const form = ref.current?.form;

    if (!form) return;

    form.addEventListener("reset", resetToDefault);

    return () => form.removeEventListener("reset", resetToDefault);
  }, [resetToDefault]);

  return (
    <input
      ref={ref}
      type="text"
      name={name}
      value={value ?? ""}
      disabled={disabled}
      className="bk-combobox-hidden-input"
      tabIndex={-1}
      aria-hidden="true"
      autoComplete="off"
      onChange={() => {}}
      required={isRequired}
      onFocus={() => inputGroupElement?.querySelector("input")?.focus()}
    />
  );
};

ComboboxHiddenInput.displayName = "Combobox.HiddenInput";
