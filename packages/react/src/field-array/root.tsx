import {
  useFieldArray,
  type UseFieldArrayOptions,
  type UseFieldArrayResult,
} from "@blankjs/core";
import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { composeRefs } from "../slot";
import { FormContext } from "../form";
import { onFormReset } from "../internal";
import { FieldArrayContext, type FieldArrayRowRef } from "./context";
import { addButton, focusFirstControl, isInRow, removeButtons } from "./focus";

export type FieldArrayProps<T> = Omit<ComponentProps<"div">, "children"> &
  UseFieldArrayOptions<T> & {
    children: (array: UseFieldArrayResult<T>) => ReactNode;
  };

type PendingFocus =
  | { kind: "control"; index: number }
  | { kind: "remove"; index: number };

export const FieldArray = <T,>({
  name,
  defaultItems,
  minItems,
  maxItems,
  children,
  className,
  ref,
  ...props
}: FieldArrayProps<T>) => {
  const array = useFieldArray<T>({ name, defaultItems, minItems, maxItems });
  const { errors, clearErrors } = useContext(FormContext) ?? {};

  const errorId = useId();
  const [dismissed, setDismissed] = useState(false);

  const error = dismissed ? undefined : errors?.[name];

  const innerRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<PendingFocus | null>(null);

  const { append, insert, remove, move, reset, canAppend, canRemove, rows } =
    array;

  const clearRowErrors = useCallback(
    () => clearErrors?.(name),
    [clearErrors, name],
  );

  const dismissArrayError = useCallback(() => setDismissed(true), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(false);
  }, [errors]);

  const appendRow = () => {
    if (!canAppend) return;

    pendingFocus.current = { kind: "control", index: rows.length };

    dismissArrayError();
    append();
  };

  const removeRow = (row: FieldArrayRowRef) => {
    if (!canRemove) return;

    const index = row.position - 1;
    const active = document.activeElement;

    if (
      isInRow(active, `${name}[${index}]`) ||
      (active instanceof HTMLElement &&
        active.dataset.bkFieldArrayRow === row.key)
    ) {
      pendingFocus.current = { kind: "remove", index };
    }

    clearRowErrors();
    remove(row.key);
  };

  const guarded = useMemo<UseFieldArrayResult<T>>(
    () => ({
      ...array,
      append: () => {
        dismissArrayError();
        append();
      },
      insert: (position) => {
        clearRowErrors();
        insert(position);
      },
      remove: (key) => {
        clearRowErrors();
        remove(key);
      },
      move: (key, position) => {
        clearRowErrors();
        move(key, position);
      },
    }),
    [array, append, insert, remove, move, clearRowErrors, dismissArrayError],
  );

  useEffect(() => {
    const target = pendingFocus.current;
    const root = innerRef.current;

    if (!target || !root) return;

    pendingFocus.current = null;

    if (target.kind === "control") {
      focusFirstControl(root, `${name}[${target.index}]`);

      return;
    }

    const buttons = removeButtons(root, name);
    const fallback =
      buttons[target.index] ?? buttons.at(-1) ?? addButton(root, name);

    if (fallback) {
      fallback.focus();

      return;
    }

    if (focusFirstControl(root, `${name}[${target.index}]`)) return;

    focusFirstControl(root, `${name}[${Math.max(target.index - 1, 0)}]`);
  });

  useEffect(() => {
    const form = innerRef.current?.closest("form");

    if (!form) return;

    return onFormReset(form, reset);
  }, [reset]);

  const contextValue = useMemo(
    () => ({
      name,
      errorId,
      error,
      canAppend,
      canRemove,
      appendRow,
      removeRow,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, errorId, error, canAppend, canRemove, rows],
  );

  return (
    <FieldArrayContext value={contextValue}>
      <div
        role="group"
        aria-describedby={error ? errorId : undefined}
        {...props}
        ref={composeRefs(innerRef, ref)}
        className={["bk-field-array", className].filter(Boolean).join(" ")}
        data-invalid={error ? "" : undefined}
      >
        {children(guarded)}
      </div>
    </FieldArrayContext>
  );
};

FieldArray.displayName = "FieldArray";
