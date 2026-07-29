import {
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  FieldContext,
  useFieldControlProps,
  usePinInput,
  type PinInputType,
} from "@blankjs/core";
import { composeRefs } from "../slot";
import { HIDDEN_INPUT_STYLE } from "../internal";
import type { Size } from "../types";

export interface PinInputProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue" | "children"
> {
  name?: string;
  length?: number;
  groups?: readonly number[];
  separator?: ReactNode;
  type?: PinInputType;
  mask?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  size?: Size;
}

const splitIntoGroups = (length: number, groups: readonly number[] | undefined) => {
  if (!groups?.length) return [Array.from({ length }, (_, i) => i)];

  const result: number[][] = [];
  let index = 0;

  for (const size of groups) {
    const group: number[] = [];

    for (let i = 0; i < size && index < length; i++) group.push(index++);

    if (group.length) result.push(group);
  }

  // a groups prop that does not add up must not swallow the remaining cells
  while (index < length) {
    (result.at(-1) ?? (result[0] = []))!.push(index++);
  }

  return result;
};

export const PinInput = ({
  name,
  length = 6,
  groups,
  separator,
  type = "numeric",
  mask,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  onComplete,
  disabled,
  required,
  autoFocus,
  size = "md",
  className,
  ref,
  ...props
}: PinInputProps) => {
  const {
    disabled: fieldDisabled,
    required: fieldRequired,
    id,
    ...fieldProps
  } = useFieldControlProps();

  const fieldContext = useContext(FieldContext);
  const labelledBy = fieldContext?.hasLabel ? fieldContext.labelId : undefined;
  const registerGroupControl = fieldContext?.registerGroupControl;

  useEffect(() => registerGroupControl?.(), [registerGroupControl]);

  const isDisabled = disabled ?? fieldDisabled;
  const isRequired = required ?? fieldRequired;

  const pin = usePinInput({
    length,
    value,
    defaultValue,
    onValueChange,
    onComplete,
    type,
    disabled: isDisabled,
  });

  const { getCellProps, focus, setValue } = pin;
  const innerRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = innerRef.current?.closest("form");

    if (!form) return;

    const onReset = () => setValue(defaultValue ?? "");

    form.addEventListener("reset", onReset);

    return () => form.removeEventListener("reset", onReset);
  }, [setValue, defaultValue]);

  // the proxy carries the value, so the browser reports validity on it; send
  // the user to a cell they can actually type into
  useEffect(() => {
    const proxy = proxyRef.current;

    if (!proxy) return;

    const onInvalid = () => focus(pin.value.length);

    proxy.addEventListener("invalid", onInvalid);

    return () => proxy.removeEventListener("invalid", onInvalid);
  }, [focus, pin.value.length]);

  return (
    <div
      {...fieldProps}
      role="group"
      {...props}
      ref={composeRefs(innerRef, ref)}
      aria-labelledby={props["aria-labelledby"] ?? labelledBy}
      data-size={size}
      data-disabled={isDisabled ? "" : undefined}
      className={["bk-pin-input", className].filter(Boolean).join(" ")}
    >
      {splitIntoGroups(length, groups).map((group, groupIndex) => (
        <div key={groupIndex} className="bk-pin-input-group">
          {groupIndex > 0 && (
            <span aria-hidden className="bk-pin-input-separator">
              {separator}
            </span>
          )}

          {group.map((index) => {
            const cell = getCellProps(index);

            return (
              <input
                {...cell}
                key={index}
                id={index === 0 ? id : undefined}
                type={mask ? "password" : "text"}
                placeholder={placeholder}
                autoFocus={autoFocus && index === 0}
                aria-label={`${index + 1} of ${length}`}
                className="bk-pin-input-cell"
              />
            );
          })}
        </div>
      ))}

      <input
        ref={proxyRef}
        type="text"
        name={name}
        value={pin.value}
        onChange={() => {}}
        required={isRequired}
        pattern={pin.pattern}
        disabled={isDisabled}
        style={HIDDEN_INPUT_STYLE}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        onFocus={() => focus(pin.value.length)}
      />
    </div>
  );
};

PinInput.displayName = "PinInput";
