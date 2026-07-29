import { act, renderHook } from "@testing-library/react";
import { usePinInput } from "./use-pin-input";
import type { UsePinInputOptions } from "./types";

const setup = (options?: UsePinInputOptions) =>
  renderHook(() => usePinInput({ length: 4, ...options }));

test("starts empty and reports the cells", () => {
  const { result } = setup();

  expect(result.current.value).toBe("");
  expect(result.current.chars).toEqual(["", "", "", ""]);
  expect(result.current.complete).toBe(false);
});

test("spreads a default value across the cells", () => {
  const { result } = setup({ defaultValue: "12" });

  expect(result.current.chars).toEqual(["1", "2", "", ""]);
});

test("drops characters the type rejects, including from the default", () => {
  const { result } = setup({ defaultValue: "1a2b" });

  expect(result.current.value).toBe("12");
});

test("alphanumeric keeps letters", () => {
  const { result } = setup({ defaultValue: "a1b2", type: "alphanumeric" });

  expect(result.current.value).toBe("a1b2");
});

test("trims a default value longer than the length", () => {
  const { result } = setup({ defaultValue: "123456" });

  expect(result.current.value).toBe("1234");
});

test("setValue replaces the whole value", () => {
  const { result } = setup();

  act(() => result.current.setValue("99"));

  expect(result.current.value).toBe("99");
});

test("clear empties it", () => {
  const { result } = setup({ defaultValue: "1234" });

  act(() => result.current.clear());

  expect(result.current.value).toBe("");
});

test("complete flips only when every cell is filled", () => {
  const { result } = setup({ defaultValue: "123" });

  expect(result.current.complete).toBe(false);

  act(() => result.current.setValue("1234"));

  expect(result.current.complete).toBe(true);
});

test("builds a pattern that rejects a short value", () => {
  const { result } = setup();

  expect(new RegExp(`^${result.current.pattern}$`).test("123")).toBe(false);
  expect(new RegExp(`^${result.current.pattern}$`).test("1234")).toBe(true);
});

test("the alphanumeric pattern accepts letters", () => {
  const { result } = setup({ type: "alphanumeric" });

  expect(new RegExp(`^${result.current.pattern}$`).test("ab12")).toBe(true);
});

test("onValueChange reports every change", () => {
  const onValueChange = vi.fn();
  const { result } = setup({ onValueChange });

  act(() => result.current.setValue("12"));

  expect(onValueChange).toHaveBeenCalledExactlyOnceWith("12");
});

test("onComplete fires only on a full value", () => {
  const onComplete = vi.fn();
  const { result } = setup({ onComplete });

  act(() => result.current.setValue("123"));
  expect(onComplete).not.toHaveBeenCalled();

  act(() => result.current.setValue("1234"));
  expect(onComplete).toHaveBeenCalledExactlyOnceWith("1234");
});

test("a controlled value ignores internal writes", () => {
  const { result } = setup({ value: "12" });

  act(() => result.current.setValue("34"));

  expect(result.current.value).toBe("12");
});

test("cell props carry the character and the input mode", () => {
  const { result } = setup({ defaultValue: "12" });

  expect(result.current.getCellProps(0).value).toBe("1");
  expect(result.current.getCellProps(3).value).toBe("");
  expect(result.current.getCellProps(0).inputMode).toBe("numeric");
  expect(result.current.getCellProps(0).autoComplete).toBe("one-time-code");
  expect(result.current.getCellProps(1).autoComplete).toBe("off");
});

test("cells accept a full code so autofill is not truncated", () => {
  const { result } = setup();

  expect(result.current.getCellProps(0).maxLength).toBe(4);
});
