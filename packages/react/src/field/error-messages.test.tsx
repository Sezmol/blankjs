import { fireEvent, render, screen } from "@testing-library/react";
import { Field } from "./index";
import { Form } from "../form";
import { TextInput } from "../text-input";

const reveal = () => fireEvent.invalid(screen.getByLabelText("Username"));

// empty value + validate returning a message raises valueMissing AND
// customError at once - the flag pair used to test priority
const twoFlagsRoot = (
  errorMessages: Partial<Record<keyof ValidityState, React.ReactNode>>,
  children?: React.ReactNode,
) => (
  <Field.Root required validate={() => "No spaces allowed"} errorMessages={errorMessages}>
    <Field.Label>Username</Field.Label>
    <TextInput name="username" />
    <Field.Error>{children}</Field.Error>
  </Field.Root>
);

test("errorMessages key order sets the priority", () => {
  render(
    twoFlagsRoot({ customError: "Custom first", valueMissing: "Missing" }),
  );

  reveal();

  expect(screen.getByText("Custom first")).toBeInTheDocument();
});

test("swapping the key order swaps the winner", () => {
  render(
    twoFlagsRoot({ valueMissing: "Missing first", customError: "Custom" }),
  );

  reveal();

  expect(screen.getByText("Missing first")).toBeInTheDocument();
});

test("an unmatched map falls back to the browser message", () => {
  render(
    <Field.Root required errorMessages={{ tooShort: "Too short" }}>
      <Field.Label>Username</Field.Label>
      <TextInput name="username" />
      <Field.Error />
    </Field.Root>,
  );

  reveal();

  const error = document.querySelector(".bk-field-error");

  expect(error).not.toBeNull();
  expect(error!.textContent).not.toBe("Too short");
  expect(error!.textContent).not.toBe("");
});

test("children beat the resolved message", () => {
  render(twoFlagsRoot({ valueMissing: "From the map" }, "Static text"));

  reveal();

  expect(screen.getByText("Static text")).toBeInTheDocument();
  expect(screen.queryByText("From the map")).toBeNull();
});

test("a map match beats the server error", () => {
  render(
    <Form errors={{ username: "Already taken" }}>
      <Field.Root
        name="username"
        required
        errorMessages={{ valueMissing: "Enter a username" }}
      >
        <Field.Label>Username</Field.Label>
        <TextInput name="username" />
        <Field.Error />
      </Field.Root>
    </Form>,
  );

  reveal();

  expect(screen.getByText("Enter a username")).toBeInTheDocument();
  expect(screen.queryByText("Already taken")).toBeNull();
});

test("the server error shows when the map has no match", () => {
  render(
    <Form errors={{ username: "Already taken" }}>
      <Field.Root name="username" errorMessages={{ tooShort: "Too short" }}>
        <Field.Label>Username</Field.Label>
        <TextInput name="username" />
        <Field.Error />
      </Field.Root>
    </Form>,
  );

  expect(screen.getByText("Already taken")).toBeInTheDocument();
});

test("manual invalid without content renders nothing", () => {
  const { container } = render(
    <Field.Root invalid>
      <Field.Label>Username</Field.Label>
      <TextInput name="username" />
      <Field.Error />
    </Field.Root>,
  );

  expect(container.querySelector(".bk-field-error")).toBeNull();
});

test("map values can be rich nodes", () => {
  render(
    twoFlagsRoot({
      customError: (
        <span data-testid="rich">
          No spaces, see the <b>rules</b>
        </span>
      ),
    }),
  );

  reveal();

  expect(screen.getByTestId("rich")).toBeInTheDocument();
});

test("undefined map entries are skipped", () => {
  render(
    twoFlagsRoot({ customError: undefined, valueMissing: "Missing" }),
  );

  reveal();

  expect(screen.getByText("Missing")).toBeInTheDocument();
});

test("exactly one error node is rendered", () => {
  const { container } = render(
    twoFlagsRoot({ customError: "Custom", valueMissing: "Missing" }),
  );

  reveal();

  expect(container.querySelectorAll(".bk-field-error")).toHaveLength(1);
});
