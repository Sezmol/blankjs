import { useEffect, useRef } from "react";
import { useMultiSelectContext } from "./context";
import { useFieldControlProps } from "@blankjs/core";

export interface MultiSelectHiddenInputProps {
  name: string;
  defaultValue?: string[];
  required?: boolean;
}

export const MultiSelectHiddenInput = ({
  name,
  defaultValue,
  required,
}: MultiSelectHiddenInputProps) => {
  const { value, setValue, disabled, triggerElement } =
    useMultiSelectContext();
  const ref = useRef<HTMLInputElement>(null);

  const controlProps = useFieldControlProps();
  const isRequired = required ?? controlProps.required ?? false;

  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

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

    const onReset = () => setValue(defaultValueRef.current ?? []);

    form.addEventListener("reset", onReset);

    return () => form.removeEventListener("reset", onReset);
  }, [setValue]);

  return (
    <>
      <input
        ref={ref}
        type="text"
        value={value.join(",")}
        disabled={disabled}
        className="bk-multi-select-hidden-input"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        onChange={() => {}}
        required={isRequired}
        onFocus={() => triggerElement?.focus()}
      />
      {value.map((v) => (
        <input
          key={v}
          type="hidden"
          name={name}
          value={v}
          disabled={disabled}
          readOnly
        />
      ))}
    </>
  );
};

MultiSelectHiddenInput.displayName = "MultiSelect.HiddenInput";
