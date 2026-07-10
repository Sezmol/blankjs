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

  // native capture listeners: React's onChangeCapture misses programmatic
  // change events dispatched by the hidden inputs of composite widgets
  useEffect(() => {
    const node = innerRef.current;

    if (!node || !onChangeCapture) return;

    const handler = (e: Event) => onChangeCapture(e as never);

    node.addEventListener("change", handler, true);
    node.addEventListener("input", handler, true);

    return () => {
      node.removeEventListener("change", handler, true);
      node.removeEventListener("input", handler, true);
    };
  }, [onChangeCapture]);

  return (
    <FieldContext value={contextValue}>
      <div
        {...props}
        ref={composeRefs(innerRef, ref)}
        data-invalid={contextValue.invalid ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onBlurCapture={onBlurCapture}
        onInvalidCapture={onInvalidCapture}
      >
        {children}
      </div>
    </FieldContext>
  );
};

FieldRoot.displayName = "Field.Root";
