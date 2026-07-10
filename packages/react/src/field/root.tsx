import {
  FieldContext,
  useFieldRoot,
  type UseFieldRootOptions,
} from "@blankjs/core";
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { composeRefs } from "../slot";
import { FormContext } from "../form";

export type FieldRootProps = UseFieldRootOptions &
  ComponentProps<"div"> & {
    name?: string;
  };

export const FieldRoot = ({
  children,
  invalid,
  disabled,
  required,
  validationMode,
  name,
  ref,
  ...props
}: FieldRootProps) => {
  const formContext = useContext(FormContext);
  const serverError = name ? formContext?.errors?.[name] : undefined;
  const [dismissed, setDismissed] = useState(false);

  const activeServerError = dismissed ? undefined : serverError;

  const {
    onBlurCapture,
    onChangeCapture,
    onInvalidCapture,
    resetValidation,
    ...contextValue
  } = useFieldRoot({
    invalid: invalid ?? (activeServerError ? true : undefined),
    disabled,
    required,
    validationMode,
  });

  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // a dismissed server error must come back when the server responds again,
    // even with the same message; the only signal is the identity of the
    // errors object, so this is a sync-with-external-value reset (one extra
    // render per server response, scoped to this field)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(false);
  }, [formContext?.errors]);

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

    const handler = (e: Event) => {
      onChangeCapture(e as never);
      setDismissed(true);
    };

    node.addEventListener("change", handler, true);
    node.addEventListener("input", handler, true);

    return () => {
      node.removeEventListener("change", handler, true);
      node.removeEventListener("input", handler, true);
    };
  }, [onChangeCapture]);

  const fieldContextValue = useMemo(
    () => ({ ...contextValue, serverError: activeServerError }),
    [activeServerError, contextValue],
  );

  return (
    <FieldContext value={fieldContextValue}>
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
