import { render, screen } from "@testing-library/react";
import { Field } from "./index";
import { PasswordField } from "../password-field";
import { NumberField } from "../number-field";
import { Slider } from "../slider";
import { Combobox } from "../combobox";

// Convention: explicit props on a control beat everything the Field
// context provides — spread order (fieldProps first) and `??` for disabled.

test.each([
  ["PasswordField", <PasswordField key="p" data-testid="control" disabled={false} />],
  ["NumberField", <NumberField key="n" data-testid="control" disabled={false} />],
  ["Slider", <Slider key="s" data-testid="control" disabled={false} />],
])("%s: explicit disabled={false} beats Field disabled", (_, control) => {
  render(
    <Field.Root disabled>
      <Field.Label>Label</Field.Label>
      {control}
    </Field.Root>,
  );

  expect(screen.getByTestId("control")).not.toBeDisabled();
});

test("Combobox.Input: explicit disabled={false} beats Field and Root disabled", () => {
  render(
    <Field.Root disabled>
      <Field.Label>Label</Field.Label>
      <Combobox.Root disabled>
        <Combobox.Input data-testid="control" disabled={false} />
        <Combobox.Content>
          <Combobox.Item value="a">A</Combobox.Item>
        </Combobox.Content>
      </Combobox.Root>
    </Field.Root>,
  );

  expect(screen.getByTestId("control")).not.toBeDisabled();
});

test("a user id overrides the field-provided id", () => {
  render(
    <Field.Root>
      <Field.Label>Label</Field.Label>
      <PasswordField data-testid="control" id="custom" />
    </Field.Root>,
  );

  expect(screen.getByTestId("control")).toHaveAttribute("id", "custom");
});

test("field context still applies when no explicit props are given", () => {
  render(
    <Field.Root disabled required>
      <Field.Label>Label</Field.Label>
      <NumberField data-testid="control" />
    </Field.Root>,
  );

  const control = screen.getByTestId("control");

  expect(control).toBeDisabled();
  expect(control).toHaveAttribute("aria-required", "true");
});
