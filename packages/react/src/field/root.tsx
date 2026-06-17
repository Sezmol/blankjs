import {
  FieldContext,
  useFieldRoot,
  type UseFieldRootOptions,
} from "@blankjs/core";
import type { ComponentProps } from "react";

type FieldRootProps = UseFieldRootOptions & ComponentProps<"div">;

export const FieldRoot = ({
  children,
  invalid,
  disabled,
  required,
  ...props
}: FieldRootProps) => {
  const contextValue = useFieldRoot({ invalid, disabled, required });

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        {...props}
        data-invalid={invalid ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
};

FieldRoot.displayName = "Field.Root";
