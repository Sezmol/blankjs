import type { ComponentProps } from "react";
import { useFieldControlProps } from "@blankjs/core";

export const TextInput = ({ className, ...props }: ComponentProps<"input">) => {
  const fieldProps = useFieldControlProps();

  return (
    <input
      {...fieldProps}
      {...props}
      className={["bk-input", className].filter(Boolean).join(" ")}
    />
  );
};

TextInput.displayName = "TextInput";
