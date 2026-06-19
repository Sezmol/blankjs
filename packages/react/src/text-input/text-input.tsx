import type { ComponentProps } from "react";
import { useFieldControlProps } from "@blankjs/core";

export const TextInput = ({ className, ...props }: ComponentProps<"input">) => {
  const fieldProps = useFieldControlProps();

  return (
    <input
      {...props}
      {...fieldProps}
      className={["bk-input", className].filter(Boolean).join(" ")}
    />
  );
};

TextInput.displayName = "TextInput";
