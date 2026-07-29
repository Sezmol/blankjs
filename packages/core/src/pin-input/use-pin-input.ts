import { useCallback, useEffect, useMemo, useRef } from "react";
import { useControllableState } from "../use-controllable-state";
import type {
  PinInputCellProps,
  PinInputType,
  UsePinInputOptions,
  UsePinInputResult,
} from "./types";

const FILTERS: Record<PinInputType, RegExp> = {
  numeric: /[^0-9]/g,
  alphanumeric: /[^a-z0-9]/gi,
};

const CHAR_CLASS: Record<PinInputType, string> = {
  numeric: "[0-9]",
  alphanumeric: "[a-zA-Z0-9]",
};

export const usePinInput = ({
  length = 6,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  type = "numeric",
  disabled,
}: UsePinInputOptions = {}): UsePinInputResult => {
  const sanitize = useCallback(
    (raw: string) => raw.replace(FILTERS[type], "").slice(0, length),
    [type, length],
  );

  const [value = "", setControllable] = useControllableState<string>({
    prop: valueProp === undefined ? undefined : sanitize(valueProp),
    defaultProp: sanitize(defaultValue),
    onChange: onValueChange,
  });

  const cells = useRef<(HTMLInputElement | null)[]>([]);
  const refs = useRef(new Map<number, PinInputCellProps["ref"]>());
  const onCompleteRef = useRef(onComplete);

  const latest = useRef(value);

  useEffect(() => {
    latest.current = value;
    onCompleteRef.current = onComplete;
  });

  const focus = useCallback(
    (index = 0) => {
      cells.current[Math.max(0, Math.min(index, length - 1))]?.focus();
    },
    [length],
  );

  const commit = useCallback(
    (next: string, focusIndex?: number) => {
      latest.current = next;

      setControllable(next);

      if (next.length === length) onCompleteRef.current?.(next);

      if (focusIndex !== undefined) focus(focusIndex);
    },
    [setControllable, length, focus],
  );

  const setValue = useCallback(
    (next: string) => commit(sanitize(next)),
    [commit, sanitize],
  );

  const clear = useCallback(() => commit("", 0), [commit]);

  const write = useCallback(
    (index: number, chunk: string) => {
      const at = Math.min(index, latest.current.length);
      const current = latest.current;

      const next =
        chunk.length > 1
          ? current.slice(0, at) + chunk
          : current.slice(0, at) + chunk + current.slice(at + 1);

      const trimmed = next.slice(0, length);

      commit(trimmed, chunk.length > 1 ? trimmed.length : at + 1);
    },
    [commit, length],
  );

  const remove = useCallback(
    (at: number) => {
      const current = latest.current;

      if (at < 0 || at >= current.length) return;

      commit(current.slice(0, at) + current.slice(at + 1), at);
    },
    [commit],
  );

  const handleBeforeInput = useCallback(
    (event: Event) => {
      const { inputType, data } = event as InputEvent;
      const index = cells.current.indexOf(event.target as HTMLInputElement);

      if (index < 0) return;

      event.preventDefault();

      if (inputType?.startsWith("delete")) {
        const back = inputType !== "deleteContentForward";

        remove(back && !latest.current[index] ? index - 1 : index);

        return;
      }

      const chunk = sanitize(data ?? "");

      if (chunk) write(index, chunk);
    },
    [remove, sanitize, write],
  );

  const beforeInputRef = useRef(handleBeforeInput);

  useEffect(() => {
    beforeInputRef.current = handleBeforeInput;
  });

  const getCellProps = useCallback(
    (index: number): PinInputCellProps => {
      if (!refs.current.has(index)) {
        refs.current.set(index, (node) => {
          cells.current[index] = node;

          if (!node) return;

          const listener = (event: Event) => beforeInputRef.current(event);

          node.addEventListener("beforeinput", listener);

          return () => {
            node.removeEventListener("beforeinput", listener);
            cells.current[index] = null;
          };
        });
      }

      return {
        ref: refs.current.get(index)!,
        value: value[index] ?? "",
        maxLength: length,
        inputMode: type === "numeric" ? "numeric" : "text",
        autoComplete: index === 0 ? "one-time-code" : "off",
        disabled,
        onChange: (event) => {
          const raw = sanitize(event.target.value);
          const existing = latest.current[index] ?? "";

          event.target.value = existing;

          if (!raw || raw === existing) return;

          const typed =
            raw.length === existing.length + 1 && raw.startsWith(existing);

          write(index, raw.length > 1 && !typed ? raw : raw.slice(-1));
        },
        onKeyDown: (event) => {
          const current = latest.current;

          if (event.key === "Backspace") {
            event.preventDefault();
            remove(current[index] ? index : index - 1);

            return;
          }

          if (event.key === "Delete") {
            event.preventDefault();
            remove(index);

            return;
          }

          const moves: Record<string, number> = {
            ArrowLeft: index - 1,
            ArrowRight: index + 1,
            Home: 0,
            End: current.length,
          };

          const target = moves[event.key];

          if (target === undefined) return;

          event.preventDefault();
          focus(target);
        },
        onPaste: (event) => {
          event.preventDefault();

          const chunk = sanitize(event.clipboardData.getData("text"));

          if (chunk) write(index, chunk);
        },
        onFocus: (event) => {
          const limit = latest.current.length;

          if (index > limit) {
            focus(limit);

            return;
          }

          event.target.select();
        },
      };
    },
    [value, disabled, focus, length, remove, sanitize, type, write],
  );

  return useMemo(
    () => ({
      value,
      chars: Array.from({ length }, (_, i) => value[i] ?? ""),
      length,
      complete: value.length === length,
      pattern: `${CHAR_CLASS[type]}{${length}}`,
      getCellProps,
      setValue,
      clear,
      focus,
    }),
    [value, length, type, getCellProps, setValue, clear, focus],
  );
};
