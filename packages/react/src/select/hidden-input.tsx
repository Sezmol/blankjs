import { useEffect, useRef } from "react";
import { useSelectContext } from "./context";

export interface SelectHiddenInputProps {
  name: string;
  defaultValue?: string;
}

export const SelectHiddenInput = ({
  name,
  defaultValue,
}: SelectHiddenInputProps) => {
  const { value, setValue, disabled } = useSelectContext();
  const ref = useRef<HTMLInputElement>(null);

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
      type="hidden"
      name={name}
      value={value ?? ""}
      disabled={disabled}
      readOnly
    />
  );
};

SelectHiddenInput.displayName = "Select.HiddenInput";
