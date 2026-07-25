import { useCallback, useMemo, useRef, useState } from "react";
import type {
  FieldName,
  UseFieldArrayOptions,
  UseFieldArrayResult,
} from "./types";

interface Entry<T> {
  key: string;
  item: T | undefined;
}

const clamp = (position: number, last: number) =>
  Math.min(Math.max(position - 1, 0), last);

// prefixed so a key can never be read as a position — a key outlives the
// renumbering that happens on every removal, and the two must not be confused
const toKey = (counter: number) => `r${counter}`;

export const useFieldArray = <T>({
  name,
  defaultItems,
  minItems = 0,
  maxItems = Infinity,
}: UseFieldArrayOptions<T>): UseFieldArrayResult<T> => {
  const [entries, setEntries] = useState<Entry<T>[]>(() => {
    const items: (T | undefined)[] = defaultItems ? [...defaultItems] : [undefined];

    while (items.length < minItems) items.push(undefined);

    return items.map((item, index) => ({ key: toKey(index), item }));
  });

  // counted rather than random so the markup is identical on server and
  // client; seeded past the initial rows so appended keys never collide
  const nextKey = useRef(Math.max(defaultItems?.length ?? 1, minItems));
  const initialEntries = useRef(entries);

  const append = useCallback(() => {
    const key = toKey(nextKey.current++);

    setEntries((current) =>
      current.length >= maxItems
        ? current
        : [...current, { key, item: undefined }],
    );
  }, [maxItems]);

  const insert = useCallback(
    (position: number) => {
      const key = toKey(nextKey.current++);

      setEntries((current) => {
        if (current.length >= maxItems) return current;

        const next = [...current];

        next.splice(clamp(position, current.length), 0, { key, item: undefined });

        return next;
      });
    },
    [maxItems],
  );

  const remove = useCallback(
    (key: string) => {
      setEntries((current) =>
        current.length <= minItems
          ? current
          : current.filter((entry) => entry.key !== key),
      );
    },
    [minItems],
  );

  const move = useCallback((key: string, position: number) => {
    setEntries((current) => {
      const from = current.findIndex((entry) => entry.key === key);
      const to = clamp(position, current.length - 1);

      if (from === -1 || from === to) return current;

      const next = [...current];
      const [entry] = next.splice(from, 1);

      next.splice(to, 0, entry!);

      return next;
    });
  }, []);

  const reset = useCallback(() => setEntries(initialEntries.current), []);

  const rows = useMemo(
    () =>
      entries.map((entry, index) => ({
        key: entry.key,
        position: index + 1,
        item: entry.item,
        name: (field?: FieldName<T>) =>
          field ? `${name}[${index}].${field}` : `${name}[${index}]`,
      })),
    [entries, name],
  );

  return useMemo(
    () => ({
      name,
      rows,
      append,
      insert,
      remove,
      move,
      reset,
      canAppend: entries.length < maxItems,
      canRemove: entries.length > minItems,
    }),
    [
      name,
      rows,
      append,
      insert,
      remove,
      move,
      reset,
      entries.length,
      maxItems,
      minItems,
    ],
  );
};
