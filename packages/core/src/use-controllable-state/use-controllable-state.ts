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

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  });

  const setValue = useCallback<SetStateFn<T>>(
    (next) => {
      const prev = isControlled ? prop : valueRef.current;
      const resolved =
        typeof next === "function"
          ? (next as (prev: T | undefined) => T)(prev)
          : next;

      if (resolved === prev) return;

      if (!isControlled) {
        setState(resolved);
        valueRef.current = resolved;
      }

      onChangeRef.current?.(resolved);
    },
    [isControlled, prop],
  );

  return [value, setValue] as const;
};
