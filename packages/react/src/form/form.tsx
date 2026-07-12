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
  onSubmit?: (data: FormData, event: FormSubmitEvent) => void;
};

export type TypedFormProps<S extends StandardSchemaV1> = FormPropsBase & {
  schema: S;
  onSubmit?: (
    data: StandardSchemaV1.InferOutput<S>,
    event: FormSubmitEvent,
  ) => void;
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

  const innerRef = useRef<HTMLFormElement>(null);

  const formContextValue = useMemo(
    () => ({
      errors: { ...schemaErrors, ...errors },
    }),
    [errors, schemaErrors],
  );

  const handleSubmit = async (e: FormSubmitEvent) => {
    if (!onSubmit) return;

    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    if (!schema) {
      onSubmit(fd, e);

      return;
    }

    const raw = serialize(fd);

    const result = await schema["~standard"].validate(raw);

    if (result.issues) {
      const fieldErrors = mapIssues(result.issues);

      setSchemaErrors(fieldErrors);

      const firstInvalid = Array.from(innerRef.current?.elements ?? []).find(
        (el): el is HTMLElement =>
          "name" in el && !!fieldErrors[(el as HTMLInputElement).name],
      );

      firstInvalid?.focus();

      return;
    }

    setSchemaErrors(undefined);

    (onSubmit as Required<TypedFormProps<S>>["onSubmit"])(result.value, e);
  };

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
      <form ref={composeRefs(innerRef, ref)} onSubmit={handleSubmit} {...rest}>
        {children}
      </form>
    </FormContext>
  );
}

Form.displayName = "Form";
