import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field } from "./index";
import { TextInput } from "../text-input";

const getInput = () => screen.getByLabelText("Email") as HTMLInputElement;

test("shows no error before validation runs", () => {
  render(
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <TextInput required />
      <Field.Error>Required</Field.Error>
    </Field.Root>,
  );

  expect(screen.queryByText("Required")).toBeNull();
  expect(getInput()).not.toHaveAttribute("aria-invalid");
});

test("reveals the error on the invalid event", () => {
  render(
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <TextInput required />
      <Field.Error>Required</Field.Error>
    </Field.Root>,
  );

  fireEvent.invalid(getInput());

  expect(screen.getByText("Required")).toBeInTheDocument();
  expect(getInput()).toHaveAttribute("aria-invalid", "true");
  expect(getInput()).toHaveAccessibleDescription("Required");
});

test("marks the root with data-invalid after reveal", () => {
  render(
    <Field.Root data-testid="root">
      <Field.Label>Email</Field.Label>
      <TextInput required />
    </Field.Root>,
  );

  expect(screen.getByTestId("root")).not.toHaveAttribute("data-invalid");

  fireEvent.invalid(getInput());

  expect(screen.getByTestId("root")).toHaveAttribute("data-invalid");
});

test("renders the native validationMessage without children", () => {
  render(
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <TextInput />
      <Field.Error />
    </Field.Root>,
  );

  getInput().setCustomValidity("Custom message");
  fireEvent.invalid(getInput());

  expect(screen.getByText("Custom message")).toBeInTheDocument();
});

test("errorMessages renders only the message for the raised flag", () => {
  render(
    <Field.Root
      errorMessages={{
        valueMissing: "Enter your email",
        typeMismatch: "Not an email",
      }}
    >
      <Field.Label>Email</Field.Label>
      <TextInput required />
      <Field.Error />
    </Field.Root>,
  );

  fireEvent.invalid(getInput());

  expect(screen.getByText("Enter your email")).toBeInTheDocument();
  expect(screen.queryByText("Not an email")).toBeNull();
});

test("clears the error once the value is fixed", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <TextInput required />
      <Field.Error>Required</Field.Error>
    </Field.Root>,
  );

  fireEvent.invalid(getInput());

  expect(screen.getByText("Required")).toBeInTheDocument();

  await user.type(getInput(), "hi");

  expect(screen.queryByText("Required")).toBeNull();
  expect(getInput()).not.toHaveAttribute("aria-invalid");
});

test("submit mode ignores blur", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <TextInput required />
      <Field.Error>Required</Field.Error>
    </Field.Root>,
  );

  await user.click(getInput());
  await user.tab();

  expect(screen.queryByText("Required")).toBeNull();
});

test("blur mode reveals the error on blur", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root validationMode="blur">
      <Field.Label>Email</Field.Label>
      <TextInput required />
      <Field.Error>Required</Field.Error>
    </Field.Root>,
  );

  await user.click(getInput());
  await user.tab();

  expect(screen.getByText("Required")).toBeInTheDocument();
});

test("blur mode stays silent while the value is valid", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root validationMode="blur">
      <Field.Label>Email</Field.Label>
      <TextInput required />
      <Field.Error>Required</Field.Error>
    </Field.Root>,
  );

  await user.type(getInput(), "hi");
  await user.tab();

  expect(screen.queryByText("Required")).toBeNull();
});

test("change mode reveals the error while typing", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root validationMode="change">
      <Field.Label>Email</Field.Label>
      <TextInput required />
      <Field.Error>Required</Field.Error>
    </Field.Root>,
  );

  await user.type(getInput(), "a");
  await user.clear(getInput());

  expect(screen.getByText("Required")).toBeInTheDocument();
});

test("manual invalid prop wins over native validity", () => {
  render(
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <TextInput />
      <Field.Error>Server error</Field.Error>
    </Field.Root>,
  );

  expect(screen.getByText("Server error")).toBeInTheDocument();
  expect(getInput()).toHaveAttribute("aria-invalid", "true");
});

test("form reset clears the revealed error", () => {
  render(
    <form>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <TextInput required />
        <Field.Error>Required</Field.Error>
      </Field.Root>
      <button type="reset">Reset</button>
    </form>,
  );

  fireEvent.invalid(getInput());

  expect(screen.getByText("Required")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Reset" }));

  expect(screen.queryByText("Required")).toBeNull();
  expect(getInput()).not.toHaveAttribute("aria-invalid");
});

test("passes the real required attribute to the control", () => {
  render(
    <Field.Root required>
      <Field.Label>Email</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  expect(getInput()).toBeRequired();
});
