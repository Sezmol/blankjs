import { useControllableState, useFieldControlProps } from "@blankjs/core";
import {
  useEffect,
  useRef,
  type ChangeEvent,
  type ComponentProps,
} from "react";
import { composeRefs } from "../slot";
import type { Size } from "../types";

export interface CheckboxProps extends Omit<
  ComponentProps<"input">,
  "type" | "checked" | "defaultChecked" | "onChange" | "size"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  onChange?: ComponentProps<"input">["onChange"];
  size?: Size;
}

export const Checkbox = ({
  checked,
  defaultChecked,
  onCheckedChange,
  indeterminate,
  onChange,
  disabled,
  className,
  size = "md",
  ...props
}: CheckboxProps) => {
  const fieldProps = useFieldControlProps();

  const [value, setValue] = useControllableState({
    prop: checked,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = ref.current?.form;

    if (!form) return;

    const onReset = () => setValue(defaultChecked ?? false);

    form.addEventListener("reset", onReset);

    return () => form.removeEventListener("reset", onReset);
  }, [setValue, defaultChecked]);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate ?? false;
  }, [indeterminate, value]);

  const isDisabled = disabled ?? fieldProps.disabled;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);

    if (e.defaultPrevented) return;

    setValue(e.target.checked);
  };

  return (
    <input
      {...fieldProps}
      {...props}
      checked={value ?? false}
      onChange={handleChange}
      ref={composeRefs(ref, props.ref)}
      disabled={isDisabled}
      data-size={size}
      className={["bk-checkbox", className].filter(Boolean).join(" ")}
      type="checkbox"
    />
  );
};
