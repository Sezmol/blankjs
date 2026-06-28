import { act, renderHook } from "@testing-library/react";
import { useControllableState } from "./use-controllable-state";

test("uncontrolled: writes to internal state and updates value", () => {
  const { result } = renderHook(() => useControllableState({ defaultProp: 0 }));

  expect(result.current[0]).toBe(0);

  act(() => {
    result.current[1](5);
  });

  expect(result.current[0]).toBe(5);
});

test("uncontrolled: calls onChange when value changes", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useControllableState({ defaultProp: 0, onChange }),
  );

  act(() => {
    result.current[1](5);
  });

  expect(result.current[0]).toBe(5);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(5);
});

test("controlled: does not touch internal state, value follows prop", () => {
  const { result, rerender } = renderHook(
    ({ prop }) => useControllableState({ prop, defaultProp: 0 }),
    { initialProps: { prop: 0 } },
  );

  expect(result.current[0]).toBe(0);

  act(() => {
    result.current[1](5);
  });

  expect(result.current[0]).toBe(0);

  rerender({ prop: 10 });
  expect(result.current[0]).toBe(10);
});

test("controlled: calls onChange with the resolved value", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useControllableState({ prop: 0, defaultProp: 0, onChange }),
  );

  act(() => {
    result.current[1](5);
  });

  expect(onChange).toHaveBeenCalledWith(5);

  act(() => {
    result.current[1]((x) => (x ?? 0) + 1);
  });

  expect(onChange).toHaveBeenLastCalledWith(1);
});

test("controlled: skips onChange when the value is unchanged", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useControllableState({ prop: 5, defaultProp: 0, onChange }),
  );

  act(() => {
    result.current[1](5);
  });

  expect(onChange).not.toHaveBeenCalled();
});

test("uncontrolled: supports an updater function", () => {
  const { result } = renderHook(() => useControllableState({ defaultProp: 0 }));

  act(() => {
    result.current[1](5);
    result.current[1]((x) => (x ?? 0) + 1);
  });

  expect(result.current[0]).toBe(6);
});

test("reflects an externally changed prop in value", () => {
  const { result, rerender } = renderHook(
    ({ prop }) => useControllableState({ prop, defaultProp: 0 }),
    { initialProps: { prop: 1 } },
  );

  expect(result.current[0]).toBe(1);

  rerender({ prop: 2 });
  expect(result.current[0]).toBe(2);
});

test("keeps a stable setValue identity across rerenders", () => {
  const { result, rerender } = renderHook(() =>
    useControllableState({ defaultProp: 0 }),
  );

  const setValueOld = result.current[1];

  rerender();

  expect(result.current[1]).toBe(setValueOld);
});

test("uncontrolled: starts as undefined without defaultProp", () => {
  const { result } = renderHook(() => useControllableState<number>({}));

  expect(result.current[0]).toBeUndefined();
});

test("uncontrolled: updater receives undefined when no value is set", () => {
  const { result } = renderHook(() => useControllableState<string>({}));

  act(() => {
    result.current[1]((prev) => prev ?? "fallback");
  });

  expect(result.current[0]).toBe("fallback");
});
