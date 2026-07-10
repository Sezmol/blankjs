import { useEffect, useMemo, useRef, type ComponentProps } from "react";
import { FormContext } from "./context";
import { composeRefs } from "../slot";

type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];

export interface FormProps extends Omit<ComponentProps<"form">, "onSubmit"> {
  onSubmit?: (data: FormData, event: FormSubmitEvent) => void;
  errors?: Record<string, string>;
}

export const Form = ({
  onSubmit,
  errors,
  ref,
  children,
  ...rest
}: FormProps) => {
  const innerRef = useRef<HTMLFormElement>(null);

  const formContextValue = useMemo(
    () => ({
      errors,
    }),
    [errors],
  );

  const handleSubmit = (e: FormSubmitEvent) => {
    if (!onSubmit) return;

    e.preventDefault();

    onSubmit(new FormData(e.currentTarget), e);
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
};

Form.displayName = "Form";
