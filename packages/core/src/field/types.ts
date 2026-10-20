import type { ComponentProps, ReactNode } from "react";

export type FieldValidationMode = "submit" | "blur" | "change";

type DivProps = Required<ComponentProps<"div">>;

export interface FieldContextValue {
  controlId: string;
  labelId: string;

  invalid: boolean;
  disabled: boolean;
  required: boolean;

  validity: ValidityState | null;
  validationMessage: string;

  serverError?: string;

  hasLabel: boolean;
  descriptionIds: string[];
  errorIds: string[];

  resolvedErrorMessage: ReactNode | undefined;
  hasGroupControl: boolean;
  registerLabel: () => () => void;
  registerDescription: (id: string) => () => void;
  registerError: (id: string) => () => void;
  registerGroupControl: () => () => void;

  refreshControl: (control: Element) => void;
}

export interface UseFieldRootOptions extends Partial<
  Pick<FieldContextValue, "invalid" | "disabled" | "required">
> {
  validationMode?: FieldValidationMode;
  validate?: (value: string, formData: FormData) => string | null | undefined;

  errorMessages?: Partial<Record<keyof ValidityState, ReactNode>>;
}

export type OnInvalidCaptureHandler = DivProps["onInvalidCapture"];
export type OnChangeCaptureHandler = DivProps["onChangeCapture"];
export type OnBlurCaptureHandler = DivProps["onBlurCapture"];

export interface FieldRootHandlerProps {
  onInvalidCapture: OnInvalidCaptureHandler;
  onChangeCapture: OnChangeCaptureHandler;
  onBlurCapture: OnBlurCaptureHandler;

  resetValidation: () => void;

  validateControl: (control: Element) => void;
}

export interface FieldControlProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-required": true | undefined;
  disabled: boolean;
  required: boolean;
}
