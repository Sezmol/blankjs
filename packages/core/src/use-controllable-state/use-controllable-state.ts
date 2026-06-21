import { useCallback, useEffect, useRef, useState } from "react";

interface UseControllableStateProps<T> {
  prop?: T;
  defaultProp: T;
  onChange?: (value: T) => void;
}

type SetStateFn<T> = (value: T | ((prev: T) => T)) => void;

export const useControllableState = <T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateProps<T>): [T, SetStateFn<T>] => {
  const [state, setState] = useState<T>(defaultProp);
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
          typeof next === "function" ? (next as (p: T) => T)(prop) : next;

        if (resolved !== prop) onChangeRef.current?.(resolved);
      } else {
        setState((prev) => {
          const resolved =
            typeof next === "function" ? (next as (p: T) => T)(prev) : next;
          onChangeRef.current?.(resolved);

          return resolved;
        });
      }
    },
    [isControlled, prop],
  );

  return [value, setValue] as const;
};
