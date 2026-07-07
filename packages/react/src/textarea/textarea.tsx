import { useFieldControlProps } from "@blankjs/core";
import type { ComponentProps } from "react";

export const Textarea = ({
  className,
  ...props
}: ComponentProps<"textarea">) => {
  const fieldProps = useFieldControlProps();

  return (
    <textarea
      rows={3}
      {...fieldProps}
      {...props}
      className={["bk-textarea", className].filter(Boolean).join(" ")}
    />
  );
};

Textarea.displayName = "Textarea";
