import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { FieldContext } from "./context";
import { useFieldControlProps } from "./use-field-control-props";
import type { FieldContextValue } from "./types";

const makeContext = (
  overrides: Partial<FieldContextValue> = {},
): FieldContextValue => ({
  controlId: "controlId",
  descriptionId: "descriptionId",
  errorId: "errorId",
  invalid: false,
  disabled: false,
  required: false,
  hasDescription: false,
  hasError: false,
  registerDescription: () => () => {},
  registerError: () => () => {},
  ...overrides,
});

const renderWithContext = (ctx: FieldContextValue) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <FieldContext.Provider value={ctx}>{children}</FieldContext.Provider>
  );

  return renderHook(() => useFieldControlProps(), { wrapper });
};

test("sets id from controlId", () => {
  const { result } = renderWithContext(makeContext({ controlId: "my-id" }));

  expect(result.current.id).toBe("my-id");
});

test("sets aria-invalid to true when invalid", () => {
  const { result } = renderWithContext(makeContext({ invalid: true }));

  expect(result.current["aria-invalid"]).toBe(true);
});

test("omits aria-invalid when valid", () => {
  const { result } = renderWithContext(makeContext());

  expect(result.current["aria-invalid"]).toBeUndefined();
});

test("sets aria-required to true when required", () => {
  const { result } = renderWithContext(makeContext({ required: true }));

  expect(result.current["aria-required"]).toBe(true);
});

test("omits aria-required when not required", () => {
  const { result } = renderWithContext(makeContext());

  expect(result.current["aria-required"]).toBeUndefined();
});

test("includes only description id when error absent", () => {
  const { result } = renderWithContext(makeContext({ hasDescription: true }));

  expect(result.current["aria-describedby"]).toContain("descriptionId");
  expect(result.current["aria-describedby"]).not.toContain("errorId");
});

test("includes both ids separated by space when present", () => {
  const { result } = renderWithContext(
    makeContext({ hasDescription: true, hasError: true }),
  );

  expect(result.current["aria-describedby"]).toBe("descriptionId errorId");
});

test("omits aria-describedby when no parts registered", () => {
  const { result } = renderWithContext(makeContext());

  expect(result.current["aria-describedby"]).toBeUndefined();
});

test("passes through disabled flag", () => {
  const { result } = renderWithContext(makeContext({ disabled: true }));

  expect(result.current.disabled).toBe(true);
});
