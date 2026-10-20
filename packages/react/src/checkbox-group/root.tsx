import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentProps,
} from "react";
import { FieldContext, useFieldControlProps } from "@blankjs/core";
import type { UseCheckboxGroupRootOptions } from "./types";
import { CheckboxGroupContext } from "./context";
import { useCheckboxGroupRoot } from "./use-checkbox-group-root";
import { syncRequired } from "./sync-required";
import { composeRefs } from "../slot";
import { getGroupItems, onFormReset } from "../internal";
import type { Size } from "../types";

const sameValues = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value) => b.includes(value));

export type CheckboxGroupRootProps = UseCheckboxGroupRootOptions &
  Omit<ComponentProps<"div">, "defaultValue" | "onChange"> & {
    size?: Size;
  };

export const CheckboxGroupRoot = ({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  name,
  className,
  size = "md",
  ...props
}: CheckboxGroupRootProps) => {
  const {
    disabled: fieldDisabled,
    required: fieldRequired,
    "aria-required": _ariaRequired,
    ...fieldProps
  } = useFieldControlProps();

  const fieldContext = useContext(FieldContext);
  const labelledBy = fieldContext?.hasLabel ? fieldContext.labelId : undefined;
  const registerGroupControl = fieldContext?.registerGroupControl;
  const refreshControl = fieldContext?.refreshControl;

  useEffect(() => registerGroupControl?.(), [registerGroupControl]);

  const group = useCheckboxGroupRoot({ value, defaultValue, onValueChange });

  const isDisabled = disabled ?? fieldDisabled ?? false;
  const isRequired = required ?? fieldRequired ?? false;

  const ref = useRef<HTMLDivElement>(null);
  const syncRef = useRef(() => {});

  useLayoutEffect(() => {
    syncRef.current = () => {
      if (!ref.current) return;

      const first = syncRequired(ref.current, isRequired);

      refreshControl?.(first ?? ref.current);
    };

    syncRef.current();
  });

  const sync = useCallback(() => syncRef.current(), []);

  useEffect(() => {
    const root = ref.current;

    if (!root) return;

    const observer = new MutationObserver(sync);

    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled"],
    });

    return () => observer.disconnect();
  }, [sync]);

  const { setValue } = group;

  const controlled = value !== undefined;

  const valueRef = useRef(group.value);
  const defaultValueRef = useRef(defaultValue);

  useLayoutEffect(() => {
    valueRef.current = group.value;
    defaultValueRef.current = defaultValue;
  });

  useEffect(() => {
    const form = ref.current?.closest("form");

    if (!form) return;

    return onFormReset(form, () => {
      const fallback = defaultValueRef.current ?? [];

      if (!sameValues(valueRef.current, fallback)) setValue(fallback);

      const target = controlled ? valueRef.current : fallback;

      if (ref.current) {
        for (const item of getGroupItems(ref.current)) {
          item.checked = target.includes(item.value);
        }
      }

      syncRef.current();
    });
  }, [setValue, controlled]);

  const contextValue = useMemo(
    () => ({
      value: group.value,
      toggle: group.toggle,
      sync,
      disabled: isDisabled,
      name,
      size,
    }),
    [group.value, group.toggle, sync, isDisabled, name, size],
  );

  return (
    <CheckboxGroupContext value={contextValue}>
      <div
        {...fieldProps}
        {...props}
        ref={composeRefs(ref, props.ref)}
        role="group"
        aria-labelledby={props["aria-labelledby"] ?? labelledBy}
        data-bk-checkbox-group=""
        data-size={size}
        className={["bk-checkbox-group", className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </CheckboxGroupContext>
  );
};

CheckboxGroupRoot.displayName = "CheckboxGroup.Root";
