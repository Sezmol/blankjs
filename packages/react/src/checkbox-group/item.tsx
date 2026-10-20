import { useLayoutEffect, type ChangeEvent, type ComponentProps } from "react";
import { useCheckboxGroupContext } from "./context";

export interface CheckboxGroupItemProps extends Omit<
  ComponentProps<"input">,
  | "type"
  | "name"
  | "checked"
  | "defaultChecked"
  | "value"
  | "size"
  | "required"
> {
  value: string;
}

export const CheckboxGroupItem = ({
  value,
  className,
  style,
  onChange,
  children,
  ...props
}: CheckboxGroupItemProps) => {
  const group = useCheckboxGroupContext();

  const checked = group.value.includes(value);
  const isDisabled = props.disabled ?? group.disabled;
  const { sync } = group;

  useLayoutEffect(() => sync(), [sync, value, checked, isDisabled]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);

    if (e.defaultPrevented) return;

    group.toggle(value, e.target.checked);
  };

  const input = (
    <input
      {...props}
      type="checkbox"
      name={group.name}
      value={value}
      checked={checked}
      onChange={handleChange}
      disabled={isDisabled}
      data-size={group.size}
      data-bk-checkbox-group-item=""
      className={
        children
          ? "bk-checkbox"
          : ["bk-checkbox", className].filter(Boolean).join(" ")
      }
      style={children ? undefined : style}
    />
  );

  if (!children) return input;

  return (
    <label
      className={["bk-checkbox-group-label", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {input}
      {children}
    </label>
  );
};

CheckboxGroupItem.displayName = "CheckboxGroup.Item";
