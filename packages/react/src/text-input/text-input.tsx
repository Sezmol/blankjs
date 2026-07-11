import type { ComponentProps } from "react";
import { useFieldControlProps } from "@blankjs/core";
import type { Size } from "../types";

export interface TextInputProps extends Omit<
  ComponentProps<"input">,
  "size" | "children" | "dangerouslySetInnerHTML"
> {
  size?: Size;
}

export const TextInput = ({
  className,
  size = "md",
  ...props
}: TextInputProps) => {
  const fieldProps = useFieldControlProps();

  return (
    <input
      {...fieldProps}
      {...props}
      data-size={size}
      className={["bk-input", className].filter(Boolean).join(" ")}
    />
  );
};

TextInput.displayName = "TextInput";
