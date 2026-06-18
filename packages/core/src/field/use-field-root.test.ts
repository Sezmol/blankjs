import { renderHook } from "@testing-library/react";
import { useFieldRoot } from "./use-field-root";

test("generates unique ids for control, description and error", () => {
  const { result } = renderHook(() => useFieldRoot());
  const { controlId, descriptionId, errorId } = result.current;

  const ids = [controlId, descriptionId, errorId];

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
  const beforeDescriptionId = result.current.descriptionId;
  const beforeErrorId = result.current.errorId;

  rerender();

  const afterControlId = result.current.controlId;
  const afterDescriptionId = result.current.descriptionId;
  const afterErrorId = result.current.errorId;

  expect(beforeControlId).toBe(afterControlId);
  expect(beforeDescriptionId).toBe(afterDescriptionId);
  expect(beforeErrorId).toBe(afterErrorId);
});
