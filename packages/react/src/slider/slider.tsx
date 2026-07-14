import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type InputEvent,
} from "react";
import type { Size } from "../types";
import { useFieldControlProps } from "@blankjs/core";
import { composeRefs } from "../slot";

type SliderProps = Omit<
  ComponentProps<"input">,
  "type" | "size" | "children" | "dangerouslySetInnerHTML"
> & { size?: Size };

const updateFill = (input: HTMLInputElement) => {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const percent = ((Number(input.value) - min) / (max - min)) * 100;

  input.style.setProperty("--bk-slider-fill", `${percent}%`);
};

export const Slider = ({
  size = "md",
  className,
  onInput,
  ref,
  disabled,
  ...props
}: SliderProps) => {
  const fieldProps = useFieldControlProps();
  const innerRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (innerRef.current) updateFill(innerRef.current);
  });

  const handleInput = (e: InputEvent<HTMLInputElement>) => {
    onInput?.(e);
    updateFill(e.currentTarget);
  };

  useEffect(() => {
    const form = innerRef.current?.form;

    if (!form) return;

    const onReset = () =>
      requestAnimationFrame(() => {
        if (innerRef.current) updateFill(innerRef.current);
      });

    form.addEventListener("reset", onReset);

    return () => form.removeEventListener("reset", onReset);
  }, []);

  const isDisabled = fieldProps.disabled || disabled;

  return (
    <input
      {...props}
      {...fieldProps}
      disabled={isDisabled}
      ref={composeRefs(innerRef, ref)}
      type="range"
      data-size={size}
      className={["bk-slider", className].filter(Boolean).join(" ")}
      onInput={handleInput}
    />
  );
};

Slider.displayName = "Slider";
