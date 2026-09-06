import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Field } from "../field";
import { MultiSelect } from "./index";

afterEach(cleanup);

const renderControl = (selected = false) => (
  <MultiSelect.Root name="choice" defaultValue={selected ? ["a"] : []} required>
    <MultiSelect.Trigger>Choose</MultiSelect.Trigger>
  </MultiSelect.Root>
);

const getForm = () => screen.getByTestId("form") as HTMLFormElement;

test("Field disabled excludes the value from FormData", () => {
  render(
    <form data-testid="form">
      <Field.Root disabled>{renderControl(true)}</Field.Root>
    </form>,
  );

  expect(screen.getByRole("combobox")).toBeDisabled();
  expect(new FormData(getForm()).has("choice")).toBe(false);
});

test("Field disabled excludes required control from validation", () => {
  render(
    <form data-testid="form">
      <Field.Root disabled>{renderControl()}</Field.Root>
    </form>,
  );

  expect(screen.getByRole("combobox")).toBeDisabled();
  expect(getForm().checkValidity()).toBe(true);
});

test("enabling Field restores serialization and validation", () => {
  const view = (disabled: boolean, selected: boolean) => (
    <form data-testid="form">
      <Field.Root disabled={disabled}>
        <MultiSelect.Root
          key={String(selected)}
          name="choice"
          defaultValue={selected ? ["a"] : []}
          required
        >
          <MultiSelect.Trigger>Choose</MultiSelect.Trigger>
        </MultiSelect.Root>
      </Field.Root>
    </form>
  );

  const { rerender } = render(view(true, true));
  rerender(view(false, true));

  expect(new FormData(getForm()).getAll("choice")).toEqual(["a"]);
  expect(getForm().checkValidity()).toBe(true);

  rerender(view(false, false));

  expect(getForm().checkValidity()).toBe(false);
});

test("trigger respects canceled click", async () => {
  render(
    <MultiSelect.Root>
      <MultiSelect.Trigger onClick={e => e.preventDefault()}>Choose</MultiSelect.Trigger>
    </MultiSelect.Root>,
  );

  await userEvent.click(screen.getByRole("combobox"));

  expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
});

test("custom validation applies to initial selection", () => {
  render(
    <form data-testid="form">
      <Field.Root validate={() => "Rejected"}>
        {renderControl(true)}
      </Field.Root>
    </form>,
  );

  expect(getForm().checkValidity()).toBe(false);
});

test("canceled keyboard leaves the list closed, normal click opens it", async () => {
  render(
    <MultiSelect.Root>
      <MultiSelect.Trigger onKeyDown={e => e.preventDefault()}>Choose</MultiSelect.Trigger>
    </MultiSelect.Root>,
  );

  const trigger = screen.getByRole("combobox");
  trigger.focus();
  await userEvent.keyboard("{ArrowDown}");

  expect(trigger).toHaveAttribute("aria-expanded", "false");

  await userEvent.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");
});

