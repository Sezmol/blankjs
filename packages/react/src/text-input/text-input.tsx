import type { ComponentProps } from "react";

export const TextInput = ({ className, ...rest }: ComponentProps<"input">) => {
  return (
    <input
      className={["bk-input", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
};

TextInput.displayName = "TextInput";
