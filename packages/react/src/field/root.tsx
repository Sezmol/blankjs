import {
  FieldContext,
  useFieldRoot,
  type UseFieldRootOptions,
} from "@blankjs/core";
import { useEffect, useRef, type ComponentProps } from "react";
import { composeRefs } from "../slot";

type FieldRootProps = UseFieldRootOptions & ComponentProps<"div">;

export const FieldRoot = ({
  children,
  invalid,
  disabled,
  required,
  validationMode,
  ref,
  ...props
}: FieldRootProps) => {
  const {
    onBlurCapture,
    onChangeCapture,
    onInvalidCapture,
    resetValidation,
    ...contextValue
  } = useFieldRoot({
    invalid,
    disabled,
    required,
    validationMode,
  });

  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = innerRef.current?.closest("form");

    if (!form) return;

    form.addEventListener("reset", resetValidation);

    return () => form.removeEventListener("reset", resetValidation);
  }, [resetValidation]);

  return (
    <FieldContext value={contextValue}>
      <div
        {...props}
        ref={composeRefs(innerRef, ref)}
        data-invalid={contextValue.invalid ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onBlurCapture={onBlurCapture}
        onChangeCapture={onChangeCapture}
        onInvalidCapture={onInvalidCapture}
      >
        {children}
      </div>
    </FieldContext>
  );
};

FieldRoot.displayName = "Field.Root";
