import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("two Description and two Error parts each get an id and all describe the control", () => {
  render(
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <TextInput />
      <Field.Description data-testid="d1">Work email</Field.Description>
      <Field.Description id="hint">We never share it</Field.Description>
      <Field.Error data-testid="e1">Required</Field.Error>
      <Field.Error id="again">Still required</Field.Error>
    </Field.Root>,
  );

  const d1 = screen.getByTestId("d1").id;
  const e1 = screen.getByTestId("e1").id;

  expect(new Set([d1, e1, "hint", "again"]).size).toBe(4);
  expect(screen.getByLabelText("Email")).toHaveAttribute(
    "aria-describedby",
    `${d1} hint ${e1} again`,
  );
});

test("a revealed error follows a controlled TextInput value", async () => {
  const user = userEvent.setup();

  const Harness = () => {
    const [value, setValue] = useState("");

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Field.Root required errorMessages={{ valueMissing: "Fill it" }}>
          <Field.Label>Name</Field.Label>
          <TextInput value={value} onChange={(e) => setValue(e.target.value)} />
          <Field.Error />
        </Field.Root>
        <button type="submit">Send</button>
        <button type="button" onClick={() => setValue("Ada")}>
          Fill
        </button>
      </form>
    );
  };

  render(<Harness />);

  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(screen.getByText("Fill it")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Fill" }));

  expect(screen.queryByText("Fill it")).toBeNull();
});
