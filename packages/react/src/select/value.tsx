import { useSelectContext } from "./context";
import type { ReactNode } from "react";

export interface SelectValueProps {
  placeholder?: ReactNode;
  children?: (value: string) => ReactNode;
}

export const SelectValue = ({ placeholder, children }: SelectValueProps) => {
  const { value } = useSelectContext();

  const getValue = () => {
    if (value === undefined) return placeholder;

    if (children) return children(value);

    return value;
  };

  return (
    <span
      className="bk-select-value"
      data-placeholder={value === undefined ? "" : undefined}
    >
      {getValue()}
    </span>
  );
};

SelectValue.displayName = "Select.Value";
