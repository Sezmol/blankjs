import { useControllableState, useFieldControlProps } from "@blankjs/core";
import {
  useEffect,
  useRef,
  type ChangeEvent,
  type ComponentProps,
} from "react";
import { composeRefs } from "../slot";

export interface SwitchProps extends Omit<
  ComponentProps<"input">,
  "type" | "checked" | "defaultChecked"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = ({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  style,
  onChange,
  ...props
}: SwitchProps) => {
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

  const isDisabled = disabled ?? fieldProps.disabled;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);

    if (e.defaultPrevented) return;

    setValue(e.target.checked);
  };

  return (
    <span
      className={["bk-switch", className].filter(Boolean).join(" ")}
      style={style}
    >
      <input
        {...fieldProps}
        {...props}
        role="switch"
        checked={value ?? false}
        onChange={handleChange}
        ref={composeRefs(ref, props.ref)}
        disabled={isDisabled}
        className="bk-switch-input"
        type="checkbox"
      />
      <span className="bk-switch-thumb" aria-hidden="true" />
    </span>
  );
};
