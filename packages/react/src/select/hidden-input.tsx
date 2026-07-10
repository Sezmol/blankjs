import { useEffect, useRef } from "react";
import { useSelectContext } from "./context";
import { useFieldControlProps } from "@blankjs/core";

export interface SelectHiddenInputProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
}

export const SelectHiddenInput = ({
  name,
  defaultValue,
  required,
}: SelectHiddenInputProps) => {
  const { value, setValue, disabled, triggerElement } = useSelectContext();
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

    const onReset = () => setValue(defaultValue);

    form.addEventListener("reset", onReset);

    return () => form.removeEventListener("reset", onReset);
  }, [setValue, defaultValue]);

  return (
    <input
      ref={ref}
      type="text"
      name={name}
      value={value ?? ""}
      disabled={disabled}
      className="bk-select-hidden-input"
      tabIndex={-1}
      aria-hidden="true"
      autoComplete="off"
      onChange={() => {}}
      required={isRequired}
      onFocus={() => triggerElement?.focus()}
    />
  );
};

SelectHiddenInput.displayName = "Select.HiddenInput";
