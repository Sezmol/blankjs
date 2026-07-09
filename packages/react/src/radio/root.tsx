import { useContext, useEffect, useRef, type ComponentProps } from "react";
import type { UseRadioGroupRootOptions } from "./types";
import { RadioGroupContext } from "./context";
import { useRadioGroupRoot } from "./use-radio-group-root";
import { FieldContext, useFieldControlProps } from "@blankjs/core";
import { composeRefs } from "../slot";

export type RadioGroupRootProps = UseRadioGroupRootOptions &
  Omit<ComponentProps<"div">, "defaultValue" | "onChange">;

export const RadioGroupRoot = ({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  className,
  ...props
}: RadioGroupRootProps) => {
  const { disabled: fieldDisabled, ...fieldProps } = useFieldControlProps();

  const fieldContext = useContext(FieldContext);
  const labelledBy = fieldContext?.hasLabel ? fieldContext.labelId : undefined;
  const registerGroupControl = fieldContext?.registerGroupControl;

  useEffect(() => registerGroupControl?.(), [registerGroupControl]);

  const contextValue = useRadioGroupRoot({
    value,
    defaultValue,
    onValueChange,
    disabled: disabled ?? fieldDisabled,
    name,
  });

  const { setValue } = contextValue;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = ref.current?.closest("form");

    if (!form) return;

    const onReset = () => setValue(defaultValue);

    form.addEventListener("reset", onReset);

    return () => form.removeEventListener("reset", onReset);
  }, [setValue, defaultValue]);

  return (
    <RadioGroupContext value={contextValue}>
      <div
        {...fieldProps}
        {...props}
        ref={composeRefs(ref, props.ref)}
        role="radiogroup"
        aria-labelledby={props["aria-labelledby"] ?? labelledBy}
        className={["bk-radio-group", className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </RadioGroupContext>
  );
};

RadioGroupRoot.displayName = "RadioGroup.Root";
