import {
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
import { mapIssues } from "./map-issues";

type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];

type FormPropsBase = Omit<ComponentProps<"form">, "onSubmit"> & {
  errors?: Record<string, string>;
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
  ref,
  children,
  schema,
  ...rest
}: UntypedFormProps | TypedFormProps<S>) {
  const [schemaErrors, setSchemaErrors] = useState<Record<string, string>>();
  const [submitting, setSubmitting] = useState(false);

  const innerRef = useRef<HTMLFormElement>(null);

  const formContextValue = useMemo(
    () => ({
      errors: { ...schemaErrors, ...errors },
      submitting,
    }),
    [errors, schemaErrors, submitting],
  );

  const focusFirstNamed = (names: Record<string, string>) => {
    const first = Array.from(innerRef.current?.elements ?? []).find(
      (el): el is HTMLElement =>
        "name" in el && !!names[(el as HTMLInputElement).name],
    );

    first?.focus();
  };

  const handleSubmit = async (e: FormSubmitEvent) => {
    if (!onSubmit) return;

    e.preventDefault();

    if (submitting) return;

    const fd = new FormData(e.currentTarget);

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
        focusFirstNamed(fieldErrors);

        return;
      }

      setSchemaErrors(undefined);

      await (onSubmit as Required<TypedFormProps<S>>["onSubmit"])(
        result.value,
        e,
      );
    } finally {
      setSubmitting(false);
    }
  };

  // focus the first control whose name has a server error; the signature
  // guard keeps an inline errors={{...}} literal from re-stealing focus
  // on every render
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

    let focused = false;

    const onInvalid = (e: Event) => {
      if (focused) return;

      focused = true;

      queueMicrotask(() => {
        focused = false;
      });

      (e.target as HTMLElement | null)?.focus?.();
    };

    form.addEventListener("invalid", onInvalid, true);

    return () => form.removeEventListener("invalid", onInvalid, true);
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
