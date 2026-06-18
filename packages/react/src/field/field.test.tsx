import { render, screen } from "@testing-library/react";
import { Field } from "./index";
import { TextInput } from "../text-input";

test("binds label, input, and description via the real DOM", () => {
  render(
    <Field.Root>
      <Field.Label>Email</Field.Label>

      <Field.Control>
        <TextInput />
      </Field.Control>

      <Field.Description>Desc</Field.Description>
    </Field.Root>,
  );

  const input = screen.getByLabelText("Email");

  expect(input).toBeInTheDocument();
  expect(input).toHaveAccessibleDescription("Desc");
});

test("exposes error text and invalid state when Field.Root is invalid", () => {
  render(
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>

      <Field.Control>
        <TextInput />
      </Field.Control>

      <Field.Error>Error</Field.Error>
    </Field.Root>,
  );

  const input = screen.getByLabelText("Email");

  expect(input).toBeInvalid();
  expect(input).toHaveAccessibleDescription("Error");
});

const Wrapper = ({ show }: { show: boolean }) => {
  return (
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>

      <Field.Control>
        <TextInput />
      </Field.Control>

      {show && <Field.Error>Error</Field.Error>}
    </Field.Root>
  );
};

test("drops the error from the accessible description when Field.Error unmounts", () => {
  const { rerender } = render(<Wrapper show={true} />);

  const input = screen.getByLabelText("Email");

  expect(input).toHaveAccessibleDescription("Error");

  rerender(<Wrapper show={false} />);

  expect(input).not.toHaveAccessibleDescription();
});

test("propagates the disabled state from Field.Root to the control", () => {
  render(
    <Field.Root disabled>
      <Field.Label>Email</Field.Label>

      <Field.Control>
        <TextInput />
      </Field.Control>
    </Field.Root>,
  );

  const input = screen.getByLabelText("Email");
  const root = input.closest("[data-disabled]");

  expect(input).toBeDisabled();
  expect(root).not.toBeNull();
});
