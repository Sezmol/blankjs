import { FieldArray as FieldArrayRoot } from "./root";
import { FieldArrayAdd } from "./add";
import { FieldArrayRemove } from "./remove";
import { FieldArrayError } from "./error";

const FieldArray = Object.assign(FieldArrayRoot, {
  Add: FieldArrayAdd,
  Remove: FieldArrayRemove,
  Error: FieldArrayError,
});

export { FieldArray, FieldArrayRoot, FieldArrayAdd, FieldArrayRemove, FieldArrayError };

export type { FieldArrayRowRef } from "./context";
export type { FieldArrayProps } from "./root";
export type { FieldArrayAddProps } from "./add";
export type { FieldArrayRemoveProps } from "./remove";
export type { FieldArrayErrorProps } from "./error";
