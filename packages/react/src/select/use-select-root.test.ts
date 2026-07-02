import { renderHook } from "@testing-library/react";
import { useSelectRoot } from "./use-select-root";

test("generates unique trigger and listbox ids", () => {
  const { result } = renderHook(() => useSelectRoot());

  expect(result.current.triggerId).toBeTruthy();
  expect(result.current.listboxId).toBeTruthy();
  expect(result.current.triggerId).not.toBe(result.current.listboxId);
});

test("defaults to closed, no value, no active item, enabled", () => {
  const { result } = renderHook(() => useSelectRoot());

  expect(result.current.open).toBe(false);
  expect(result.current.value).toBeUndefined();
  expect(result.current.activeItem).toBeUndefined();
  expect(result.current.disabled).toBe(false);
});

test("seeds value from defaultValue in uncontrolled mode", () => {
  const { result } = renderHook(() => useSelectRoot({ defaultValue: "us" }));

  expect(result.current.value).toBe("us");
});

test("reflects the disabled option in context", () => {
  const { result } = renderHook(() => useSelectRoot({ disabled: true }));

  expect(result.current.disabled).toBe(true);
});

test("keeps ids stable across rerenders", () => {
  const { result, rerender } = renderHook(() => useSelectRoot());

  const before = result.current.triggerId;

  rerender();

  const after = result.current.triggerId;

  expect(after).toBe(before);
});
