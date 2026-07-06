import type { ChangeEvent, ComponentProps } from "react";
import { useRadioGroupContext } from "./context";

export interface RadioGroupItemProps extends Omit<
  ComponentProps<"input">,
  "type" | "name" | "checked" | "defaultChecked" | "value"
> {
  value: string;
}

export const RadioGroupItem = ({
  className,
  style,
  onChange,
  children,
  ...props
}: RadioGroupItemProps) => {
  const {
    name,
    setValue,
    value: contextValue,
    disabled,
  } = useRadioGroupContext();

  const isDisabled = props.disabled ?? disabled;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);

    if (e.defaultPrevented) return;

    setValue(e.target.value);
  };

  const input = (
    <input
      {...props}
      checked={contextValue === props.value}
      onChange={handleChange}
      disabled={isDisabled}
      type="radio"
      name={name}
      className={
        children
          ? "bk-radio-item"
          : ["bk-radio-item", className].filter(Boolean).join(" ")
      }
      style={children ? undefined : style}
    />
  );

  if (!children) return input;

  return (
    <label
      className={["bk-radio-label", className].filter(Boolean).join(" ")}
      style={style}
    >
      {input}
      {children}
    </label>
  );
};

RadioGroupItem.displayName = "RadioGroup.Item";
