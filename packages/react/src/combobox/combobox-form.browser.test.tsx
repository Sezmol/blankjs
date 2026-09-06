import { cleanup, render, screen } from "@testing-library/react";
import { Field } from "../field";
import { Combobox } from "./index";

afterEach(cleanup);

const renderControl = (selected = false) => (
  <Combobox.Root name="choice" defaultValue={selected ? "a" : undefined} required>
    <Combobox.Input />
  </Combobox.Root>
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
        <Combobox.Root
          key={String(selected)}
          name="choice"
          defaultValue={selected ? "a" : undefined}
          required
        >
          <Combobox.Input />
        </Combobox.Root>
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

