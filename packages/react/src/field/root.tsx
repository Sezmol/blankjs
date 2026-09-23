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
import {
  focusOnSubmitAttempt,
  onFormReset,
  watchSubmitAttempts,
} from "../internal";

export type FieldRootProps = UseFieldRootOptions &
  ComponentProps<"div"> & {
    name?: string;
  };

const findValueControl = (root: HTMLElement | null, controlId: string) =>
  root?.querySelector(`[data-bk-field-control="${controlId}"]`) ?? null;

const findControl = (root: HTMLElement | null, controlId: string) =>
  findValueControl(root, controlId) ??
  root?.querySelector(`[id="${controlId}"]`);

const isValueTarget = (
  root: HTMLElement | null,
  controlId: string,
  target: EventTarget | null,
) => {
  const valueControl = findValueControl(root, controlId);

  return !valueControl || target === valueControl;
};

export const FieldRoot = ({
  children,
  invalid,
  disabled,
  required,
  validationMode,
  name,
  ref,
  validate,
  errorMessages,
  className,
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
    validateControl,
    ...contextValue
  } = useFieldRoot({
    invalid: invalid ?? (activeServerError ? true : undefined),
    disabled,
    required,
    validationMode,
    validate,
    errorMessages,
  });

  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => watchSubmitAttempts(), []);

  useEffect(() => {
    const control = findControl(innerRef.current, contextValue.controlId);

    if (control) validateControl(control);
  }, [validateControl, contextValue.controlId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(false);
  }, [formContext?.errors]);

  useEffect(() => {
    const form = innerRef.current?.closest("form");

    if (!form) return;

    return onFormReset(form, () => {
      resetValidation();

      const control = findControl(innerRef.current, contextValue.controlId);

      if (control) validateControl(control);
    });
  }, [resetValidation, validateControl, contextValue.controlId]);

  useEffect(() => {
    const node = innerRef.current;

    if (!node || !onChangeCapture) return;

    const handler = (e: Event) => {
      if (isValueTarget(node, contextValue.controlId, e.target)) {
        onChangeCapture(e as never);
      }

      setDismissed(true);
    };

    node.addEventListener("change", handler, true);
    node.addEventListener("input", handler, true);

    return () => {
      node.removeEventListener("change", handler, true);
      node.removeEventListener("input", handler, true);
    };
  }, [onChangeCapture, contextValue.controlId]);

  const fieldContextValue = useMemo(
    () => ({ ...contextValue, serverError: activeServerError }),
    [activeServerError, contextValue],
  );

  return (
    <FieldContext value={fieldContextValue}>
      <div
        {...props}
        ref={composeRefs(innerRef, ref)}
        className={["bk-field", className].filter(Boolean).join(" ")}
        data-invalid={contextValue.invalid ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onBlurCapture={(e) => {
          const field = e.currentTarget;
          const valueControl = findValueControl(field, contextValue.controlId);

          if (!valueControl || e.target === valueControl) {
            onBlurCapture?.(e);
          } else if (!field.contains(e.relatedTarget)) {
            onBlurCapture?.({ ...e, target: valueControl } as never);
          }
        }}
        onInvalidCapture={(e) => {
          onInvalidCapture?.(e);
          focusOnSubmitAttempt(e.target);
        }}
      >
        {children}
      </div>
    </FieldContext>
  );
};

FieldRoot.displayName = "Field.Root";
