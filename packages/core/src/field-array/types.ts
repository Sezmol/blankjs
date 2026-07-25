export type FieldName<T> = unknown extends T ? string : keyof T & string;

export interface FieldArrayRow<T> {
  key: string;
  position: number;
  item: T | undefined;
  name: (field?: FieldName<T>) => string;
}

export interface UseFieldArrayOptions<T> {
  name: string;
  defaultItems?: readonly T[];
  minItems?: number;
  maxItems?: number;
}

export interface UseFieldArrayResult<T> {
  name: string;
  rows: FieldArrayRow<T>[];

  append: () => void;
  insert: (position: number) => void;
  remove: (key: string) => void;
  move: (key: string, position: number) => void;
  reset: () => void;

  canAppend: boolean;
  canRemove: boolean;
}
