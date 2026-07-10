import type { ComponentProps } from "react";

export type FieldValidationMode = "submit" | "blur" | "change";

type DivProps = Required<ComponentProps<"div">>;

export interface FieldContextValue {
  controlId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;

  invalid: boolean;
  disabled: boolean;
  required: boolean;

  validity: ValidityState | null;
  validationMessage: string;

  serverError?: string;

  hasLabel: boolean;
  hasDescription: boolean;
  hasError: boolean;
  hasGroupControl: boolean;
  registerLabel: () => () => void;
  registerDescription: () => () => void;
  registerError: () => () => void;
  registerGroupControl: () => () => void;
}

export interface UseFieldRootOptions extends Partial<
  Pick<FieldContextValue, "invalid" | "disabled" | "required">
> {
  validationMode?: FieldValidationMode;
  validate?: (value: string) => string | null | undefined;
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
