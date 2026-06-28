import { useCallback, useEffect, useRef, useState } from "react";

interface UseControllableStateProps<T> {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
}

export type SetStateFn<T> = (value: T | ((prev: T | undefined) => T)) => void;

export const useControllableState = <T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateProps<T>): [T | undefined, SetStateFn<T>] => {
  const [state, setState] = useState<T | undefined>(defaultProp);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const isControlled = prop !== undefined;
  const value = isControlled ? prop : state;

  const setValue = useCallback<SetStateFn<T>>(
    (next) => {
      if (isControlled) {
        const resolved =
          typeof next === "function"
            ? (next as (prev: T | undefined) => T)(prop)
            : next;

        if (resolved !== prop) onChangeRef.current?.(resolved);
      } else {
        setState((prev) => {
          const resolved =
            typeof next === "function"
              ? (next as (prev: T | undefined) => T)(prev)
              : next;
          onChangeRef.current?.(resolved);

          return resolved;
        });
      }
    },
    [isControlled, prop],
  );

  return [value, setValue] as const;
};
