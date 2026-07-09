export interface FieldContextValue {
  controlId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;

  invalid: boolean;
  disabled: boolean;
  required: boolean;

  hasLabel: boolean;
  hasDescription: boolean;
  hasError: boolean;
  hasGroupControl: boolean;
  registerLabel: () => () => void;
  registerDescription: () => () => void;
  registerError: () => () => void;
  registerGroupControl: () => () => void;
}

export type UseFieldRootOptions = Partial<
  Pick<FieldContextValue, "invalid" | "disabled" | "required">
>;

export interface FieldControlProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-required": true | undefined;
  disabled: boolean;
}
