import { useFieldControlProps } from "@blankjs/core";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type InputEvent,
} from "react";
import { composeRefs } from "../slot";
import type { Size } from "../types";

type NumberFieldProps = Omit<
  ComponentProps<"input">,
  "size" | "children" | "dangerouslySetInnerHTML" | "type"
> & {
  size?: Size;
};

export const NumberField = ({
  className,
  disabled,
  size = "md",
  onInput,
  ref,
  ...rest
}: NumberFieldProps) => {
  const fieldProps = useFieldControlProps();

  const [atMin, setAtMin] = useState(false);
  const [atMax, setAtMax] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isDisabled = disabled ?? fieldProps.disabled;

  const mergedInput = ["bk-input", className].filter(Boolean).join(" ");

  const updateBounds = (input: HTMLInputElement) => {
    const value = Number(input.value);

    setAtMin(
      input.value !== "" && input.min !== "" && value <= Number(input.min),
    );
    setAtMax(
      input.value !== "" && input.max !== "" && value >= Number(input.max),
    );
  };

  const step = (direction: "up" | "down") => {
    const input = inputRef.current;

    if (!input) return;

    if (direction === "up") {
      input.stepUp();
    } else {
      input.stepDown();
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));

    input.focus();
  };

  const handleInput = (e: InputEvent<HTMLInputElement>) => {
    onInput?.(e);
    updateBounds(e.currentTarget);
  };

  useLayoutEffect(() => {
    if (inputRef.current) updateBounds(inputRef.current);
  });

  useEffect(() => {
    const form = inputRef.current?.form;

    if (!form) return;

    const onReset = () =>
      requestAnimationFrame(() => {
        if (inputRef.current) updateBounds(inputRef.current);
      });

    form.addEventListener("reset", onReset);

    return () => form.removeEventListener("reset", onReset);
  }, []);

  return (
    <div className="bk-number-field" data-size={size}>
      <button
        className="bk-number-field-button"
        type="button"
        tabIndex={-1}
        disabled={isDisabled || atMin}
        aria-label="Decrease"
        onClick={() => step("down")}
        onMouseDown={(e) => e.preventDefault()}
      >
        −
      </button>

      <input
        {...fieldProps}
        {...rest}
        ref={composeRefs(inputRef, ref)}
        type="number"
        disabled={isDisabled}
        className={mergedInput}
        onInput={handleInput}
      />

      <button
        className="bk-number-field-button"
        type="button"
        tabIndex={-1}
        disabled={isDisabled || atMax}
        aria-label="Increase"
        onClick={() => step("up")}
        onMouseDown={(e) => e.preventDefault()}
      >
        +
      </button>
    </div>
  );
};
