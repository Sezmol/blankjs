/**
 * What `row.name()` accepts. Narrows to the keys of the row once T is known,
 * and stays open when there is nothing to narrow against — otherwise every
 * array without `defaultItems` would end up with `keyof unknown`, which is
 * `never`, and no name would be writable at all.
 */
export type FieldName<T> = unknown extends T ? string : keyof T & string;

export interface FieldArrayRow<T> {
  /** React key — stable for the lifetime of the row */
  key: string;
  /** 1-based, for labels like "Person 2". Never use it as a React key. */
  position: number;
  /** the entry of `defaultItems` this row was seeded with */
  item: T | undefined;
  /** `name("email")` -> `users[0].email`, `name()` -> `users[0]` */
  name: (field?: FieldName<T>) => string;
}

export interface UseFieldArrayOptions<T> {
  name: string;
  /** seeds the rows; one empty row when omitted */
  defaultItems?: readonly T[];
  minItems?: number;
  maxItems?: number;
}

export interface UseFieldArrayResult<T> {
  name: string;
  rows: FieldArrayRow<T>[];

  append: () => void;
  /** 1-based, clamped to the ends */
  insert: (position: number) => void;
  remove: (key: string) => void;
  /** 1-based, clamped to the ends */
  move: (key: string, position: number) => void;
  reset: () => void;

  canAppend: boolean;
  canRemove: boolean;
}
