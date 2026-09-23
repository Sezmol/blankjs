import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type JSX,
} from "react";
import { FormContext } from "./context";
import { composeRefs } from "../slot";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { serialize } from "./serialize";
import { formIssue, mapIssues } from "./map-issues";
import { isUnderPath } from "./parse-path";
import { FormError } from "./form-error";
import { onFormReset } from "../internal";

type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];

type FormPropsBase = Omit<ComponentProps<"form">, "onSubmit" | "error"> & {
  errors?: Record<string, string>;
  error?: string;
};

export type UntypedFormProps = FormPropsBase & {
  schema?: undefined;
  onSubmit?: (data: FormData, event: FormSubmitEvent) => void | Promise<void>;
};

export type TypedFormProps<S extends StandardSchemaV1> = FormPropsBase & {
  schema: S;
  onSubmit?: (
    data: StandardSchemaV1.InferOutput<S>,
    event: FormSubmitEvent,
  ) => void | Promise<void>;
};

export type FormProps<S extends StandardSchemaV1 = StandardSchemaV1> =
  | UntypedFormProps
  | TypedFormProps<S>;

export function Form(props: UntypedFormProps): JSX.Element;

export function Form<S extends StandardSchemaV1>(
  props: TypedFormProps<S>,
): JSX.Element;

export function Form<S extends StandardSchemaV1>({
  onSubmit,
  errors,
  error,
  ref,
  children,
  schema,
  ...rest
}: UntypedFormProps | TypedFormProps<S>) {
  const [schemaErrors, setSchemaErrors] = useState<Record<string, string>>();
  const [schemaError, setSchemaError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const innerRef = useRef<HTMLFormElement>(null);

  const clearErrors = useCallback((prefix: string) => {
    setSchemaErrors((current) => {
      if (!current) return current;

      const kept = Object.entries(current).filter(
        ([name]) => !isUnderPath(name, prefix),
      );

      return kept.length === Object.keys(current).length
        ? current
        : Object.fromEntries(kept);
    });
  }, []);

  const mergedErrors = useMemo(
    () => ({ ...schemaErrors, ...errors }),
    [schemaErrors, errors],
  );

  const formContextValue = useMemo(
    () => ({
      errors: mergedErrors,
      error: error ?? schemaError,
      submitting,
      clearErrors,
    }),
    [mergedErrors, error, schemaError, submitting, clearErrors],
  );

  const focusFirstNamed = (names: Record<string, string>) => {
    const first = Array.from(innerRef.current?.elements ?? []).find(
      (el): el is HTMLElement => {
        const control = el as HTMLInputElement;
        const name = control.name || control.dataset.bkName;

        return !!name && !!names[name] && control.type !== "hidden";
      },
    );

    first?.focus();
  };

  const handleSubmit = async (e: FormSubmitEvent) => {
    if (e.target !== e.currentTarget || !onSubmit) return;

    e.preventDefault();

    if (submitting) return;

    const fd = new FormData(
      e.currentTarget,
      (e.nativeEvent as SubmitEvent).submitter,
    );

    setSubmitting(true);

    try {
      if (!schema) {
        await onSubmit(fd, e);

        return;
      }

      const raw = serialize(fd);

      const result = await schema["~standard"].validate(raw);

      if (result.issues) {
        const fieldErrors = mapIssues(result.issues);

        setSchemaErrors(fieldErrors);
        setSchemaError(formIssue(result.issues));
        focusFirstNamed(fieldErrors);

        return;
      }

      setSchemaErrors(undefined);
      setSchemaError(undefined);

      await (onSubmit as Required<TypedFormProps<S>>["onSubmit"])(
        result.value,
        e,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const errorsSignature = useRef("");

  useEffect(() => {
    const signature = errors ? JSON.stringify(errors) : "";

    if (signature === errorsSignature.current) return;

    errorsSignature.current = signature;

    if (errors && Object.keys(errors).length > 0) focusFirstNamed(errors);
  });

  useEffect(() => {
    const form = innerRef.current;

    if (!form) return;

    return onFormReset(form, () => {
      setSchemaErrors(undefined);
      setSchemaError(undefined);
    });
  }, []);

  return (
    <FormContext value={formContextValue}>
      <form
        ref={composeRefs(innerRef, ref)}
        onSubmit={handleSubmit}
        data-submitting={submitting ? "" : undefined}
        {...rest}
      >
        {children}
      </form>
    </FormContext>
  );
}

Form.displayName = "Form";
Form.Error = FormError;
