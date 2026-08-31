import { useContext, type ComponentProps } from "react";
import { FormContext } from "./context";

export type FormErrorProps = ComponentProps<"div">;

export const FormError = ({
  children,
  className,
  ...props
}: FormErrorProps) => {
  const { error } = useContext(FormContext) ?? {};

  const content = children ?? error;

  if (content == null || content === "") return null;

  return (
    <div
      role="alert"
      {...props}
      className={["bk-form-error", className].filter(Boolean).join(" ")}
    >
      {content}
    </div>
  );
};

FormError.displayName = "Form.Error";
