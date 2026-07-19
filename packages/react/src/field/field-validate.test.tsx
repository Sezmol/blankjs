import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field } from "./index";
import { TextInput } from "../text-input";

const getInput = () => screen.getByLabelText("Username") as HTMLInputElement;

const noSpaces = (value: string) =>
  value.includes(" ") ? "No spaces allowed" : null;

test("validate failure sets customError on the control", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root validate={noSpaces}>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  await user.type(getInput(), "a b");

  expect(getInput().validity.customError).toBe(true);
  expect(getInput().checkValidity()).toBe(false);
});

test("change mode reveals the validate message while typing", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root validate={noSpaces} validationMode="change">
      <Field.Label>Username</Field.Label>
      <TextInput />
      <Field.Error />
    </Field.Root>,
  );

  await user.type(getInput(), "a b");

  expect(screen.getByText("No spaces allowed")).toBeInTheDocument();
  expect(getInput()).toHaveAttribute("aria-invalid", "true");
});

test("errorMessages picks customError over valueMissing for validate failures", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root
      validate={noSpaces}
      validationMode="change"
      required
      errorMessages={{ customError: "No spaces", valueMissing: "Required" }}
    >
      <Field.Label>Username</Field.Label>
      <TextInput />
      <Field.Error />
    </Field.Root>,
  );

  await user.type(getInput(), "a b");

  expect(screen.getByText("No spaces")).toBeInTheDocument();
  expect(screen.queryByText("Required")).toBeNull();
});

test("clears the custom error once the value is fixed", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root validate={noSpaces} validationMode="change">
      <Field.Label>Username</Field.Label>
      <TextInput />
      <Field.Error />
    </Field.Root>,
  );

  await user.type(getInput(), "a b");

  expect(screen.getByText("No spaces allowed")).toBeInTheDocument();

  await user.type(getInput(), "{backspace}{backspace}");

  expect(screen.queryByText("No spaces allowed")).toBeNull();
  expect(getInput().validity.customError).toBe(false);
  expect(getInput()).not.toHaveAttribute("aria-invalid");
});

test("blur mode reveals the validate message on blur", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root validate={noSpaces} validationMode="blur">
      <Field.Label>Username</Field.Label>
      <TextInput />
      <Field.Error />
    </Field.Root>,
  );

  await user.type(getInput(), "a b");
  await user.tab();

  expect(screen.getByText("No spaces allowed")).toBeInTheDocument();
});

test("runs validate on mount so untouched fields block submit", () => {
  render(
    <Field.Root validate={() => "Always broken"}>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  expect(getInput().validity.customError).toBe(true);
  expect(getInput().checkValidity()).toBe(false);
});

test("reveals the custom error on the invalid event", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root validate={noSpaces}>
      <Field.Label>Username</Field.Label>
      <TextInput />
      <Field.Error />
    </Field.Root>,
  );

  await user.type(getInput(), "a b");

  expect(screen.queryByText("No spaces allowed")).toBeNull();

  fireEvent.invalid(getInput());

  expect(screen.getByText("No spaces allowed")).toBeInTheDocument();
});

test("validate sees the whole form for cross-field rules", async () => {
  const user = userEvent.setup();

  render(
    <form>
      <Field.Root name="password">
        <Field.Label>Password</Field.Label>
        <TextInput name="password" />
      </Field.Root>

      <Field.Root
        validate={(value, formData) =>
          value !== formData.get("password") ? "Passwords do not match" : null
        }
        validationMode="change"
      >
        <Field.Label>Confirm</Field.Label>
        <TextInput name="confirm" />
        <Field.Error />
      </Field.Root>
    </form>,
  );

  await user.type(screen.getByLabelText("Password"), "secret");
  await user.type(screen.getByLabelText("Confirm"), "secre");

  expect(screen.getByText("Passwords do not match")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Confirm"), "t");

  expect(screen.queryByText("Passwords do not match")).toBeNull();
});

test("stays silent without validate", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  await user.type(getInput(), "a b");

  expect(getInput().validity.customError).toBe(false);
  expect(getInput().checkValidity()).toBe(true);
});
