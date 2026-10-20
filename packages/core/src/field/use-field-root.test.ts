import { renderHook } from "@testing-library/react";
import { useFieldRoot } from "./use-field-root";

test("generates unique ids for control and label", () => {
  const { result } = renderHook(() => useFieldRoot());
  const { controlId, labelId } = result.current;

  const ids = [controlId, labelId];

  expect(new Set(ids).size).toBe(ids.length);
});

test("defaults all flags to false", () => {
  const { result } = renderHook(() => useFieldRoot());
  const { disabled, invalid, required } = result.current;

  expect(disabled).toBe(false);
  expect(invalid).toBe(false);
  expect(required).toBe(false);
});

test("passes through provided options", () => {
  const { result } = renderHook(() =>
    useFieldRoot({ disabled: true, invalid: true, required: true }),
  );
  const { disabled, invalid, required } = result.current;

  expect(disabled).toBe(true);
  expect(invalid).toBe(true);
  expect(required).toBe(true);
});

test("keeps ids stable across rerenders", () => {
  const { result, rerender } = renderHook(() => useFieldRoot());
  const beforeControlId = result.current.controlId;
  const beforeLabelId = result.current.labelId;

  rerender();

  const afterControlId = result.current.controlId;
  const afterLabelId = result.current.labelId;

  expect(beforeControlId).toBe(afterControlId);
  expect(beforeLabelId).toBe(afterLabelId);
});
