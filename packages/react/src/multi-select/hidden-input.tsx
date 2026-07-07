import { useEffect, useRef } from "react";
import { useMultiSelectContext } from "./context";

export interface MultiSelectHiddenInputProps {
  name: string;
  defaultValue?: string[];
}

export const MultiSelectHiddenInput = ({
  name,
  defaultValue,
}: MultiSelectHiddenInputProps) => {
  const { value, setValue, disabled } = useMultiSelectContext();
  const ref = useRef<HTMLInputElement>(null);

  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    const form = ref.current?.form;

    if (!form) return;

    const onReset = () => setValue(defaultValueRef.current ?? []);

    form.addEventListener("reset", onReset);

    return () => form.removeEventListener("reset", onReset);
  }, [setValue]);

  return (
    <>
      <input ref={ref} type="hidden" value="" readOnly />
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

MultiSelectHiddenInput.displayName = "Select.HiddenInput";
