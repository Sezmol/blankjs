import type { ReactNode } from "react";
import { useMultiSelectContext } from "./context";

export interface MultiSelectValueProps {
  placeholder?: string;
  children?: (value: string[]) => ReactNode;
}

export const MultiSelectValue = ({
  placeholder,
  children,
}: MultiSelectValueProps) => {
  const { value } = useMultiSelectContext();

  const isValueEmpty = value.length === 0;

  const getValue = () => {
    if (isValueEmpty) return placeholder;

    if (children) return children(value);

    return value.join(", ");
  };

  return (
    <span
      className="bk-multi-select-value"
      data-placeholder={isValueEmpty ? "" : undefined}
    >
      {getValue()}
    </span>
  );
};

MultiSelectValue.displayName = "MultiSelect.Value";
