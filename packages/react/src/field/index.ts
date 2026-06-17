import { FieldRoot } from "./root";
import { FieldLabel } from "./label";
import { FieldDescription } from "./description";
import { FieldError } from "./error";
import { FieldControl } from "./control";

export { FieldControl, FieldRoot, FieldLabel, FieldDescription, FieldError };

export const Field = {
  Control: FieldControl,
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
};
