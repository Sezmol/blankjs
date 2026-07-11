import { useFieldControlProps } from "@blankjs/core";
import type { ComponentProps } from "react";
import type { Size } from "../types";

export interface TextareaProps extends Omit<
  ComponentProps<"textarea">,
  "children" | "dangerouslySetInnerHTML"
> {
  size?: Size;
}

export const Textarea = ({
  className,
  size = "md",
  ...props
}: TextareaProps) => {
  const fieldProps = useFieldControlProps();

  return (
    <textarea
      rows={3}
      {...fieldProps}
      {...props}
      data-size={size}
      className={["bk-textarea", className].filter(Boolean).join(" ")}
    />
  );
};

Textarea.displayName = "Textarea";
