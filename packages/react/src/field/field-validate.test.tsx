import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field } from "./index";
import { TextInput } from "../text-input";
import { Combobox } from "../combobox";
import { Select } from "../select";
import { PinInput } from "../pin-input";
import { RadioGroup } from "../radio";
import { Checkbox } from "../checkbox";

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

test("validate checks the committed Combobox value, not the typed query", async () => {
  const user = userEvent.setup();

  render(
    <form data-testid="form">
      <Field.Root validate={(value) => (value === "a" ? null : "Pick Apple")}>
        <Combobox.Root name="fruit">
          <Combobox.Input aria-label="Fruit" />
          <Combobox.Content>
            <Combobox.Item value="a">Apple</Combobox.Item>
            <Combobox.Item value="b">Banana</Combobox.Item>
          </Combobox.Content>
        </Combobox.Root>
      </Field.Root>
    </form>,
  );

  const form = screen.getByTestId("form") as HTMLFormElement;

  expect(form.checkValidity()).toBe(false);

  await user.type(screen.getByRole("combobox"), "App");
  await user.click(screen.getByRole("option", { name: "Apple" }));

  expect(form.checkValidity()).toBe(true);
});

test("validate checks the whole PinInput code", async () => {
  const user = userEvent.setup();

  render(
    <form data-testid="form">
      <Field.Root validate={(value) => (value === "123" ? null : "Wrong code")}>
        <PinInput name="pin" length={3} />
      </Field.Root>
    </form>,
  );

  const form = screen.getByTestId("form") as HTMLFormElement;

  expect(form.checkValidity()).toBe(false);

  await user.click(screen.getAllByRole("textbox")[0]!);
  await user.keyboard("123");

  expect(form.checkValidity()).toBe(true);
});

test("validate message leaves the radio that is no longer checked", async () => {
  const user = userEvent.setup();

  render(
    <form data-testid="form">
      <Field.Root validate={(value) => (value === "b" ? null : "Pick B")}>
        <RadioGroup.Root name="size" aria-label="Size">
          <RadioGroup.Item value="a" aria-label="A" />
          <RadioGroup.Item value="b" aria-label="B" />
        </RadioGroup.Root>
      </Field.Root>
    </form>,
  );

  const form = screen.getByTestId("form") as HTMLFormElement;

  await user.click(screen.getByRole("radio", { name: "A" }));

  expect(form.checkValidity()).toBe(false);

  await user.click(screen.getByRole("radio", { name: "B" }));

  expect(form.checkValidity()).toBe(true);
});

test("validate reads the checked radio, not the one that lost focus", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root
      validate={(value) => (value ? null : "Pick a size")}
      validationMode="blur"
    >
      <RadioGroup.Root name="size" aria-label="Size">
        <RadioGroup.Item value="a" aria-label="A" />
        <RadioGroup.Item value="b" aria-label="B" />
      </RadioGroup.Root>
      <Field.Error />
    </Field.Root>,
  );

  await user.tab();
  await user.tab();

  expect(screen.getByText("Pick a size")).toBeInTheDocument();
});

test("validate sees an unchecked Checkbox as empty", async () => {
  const user = userEvent.setup();

  render(
    <form data-testid="form">
      <Field.Root validate={(value) => (value ? null : "Must agree")}>
        <Checkbox aria-label="Agree" name="agree" />
      </Field.Root>
    </form>,
  );

  const form = screen.getByTestId("form") as HTMLFormElement;

  expect(form.checkValidity()).toBe(false);

  await user.click(screen.getByRole("checkbox"));

  expect(form.checkValidity()).toBe(true);
});

test("blur mode reveals a required Select once focus leaves the field", async () => {
  const user = userEvent.setup();

  render(
    <>
      <Field.Root required validationMode="blur" data-testid="field">
        <Field.Label>Fruit</Field.Label>
        <Select.Root name="fruit">
          <Select.Trigger>
            <Select.Value placeholder="Pick" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">Apple</Select.Item>
          </Select.Content>
        </Select.Root>
      </Field.Root>
      <button>After</button>
    </>,
  );

  await user.tab();

  expect(screen.getByTestId("field")).not.toHaveAttribute("data-invalid");

  await user.tab();

  expect(screen.getByTestId("field")).toHaveAttribute("data-invalid");
});

test("blur mode reveals a Combobox validate error once focus leaves the field", async () => {
  const user = userEvent.setup();

  render(
    <>
      <Field.Root
        validate={(value) => (value === "a" ? null : "Pick Apple")}
        validationMode="blur"
      >
        <Combobox.Root name="fruit">
          <Combobox.Input aria-label="Fruit" />
          <Combobox.Content>
            <Combobox.Item value="a">Apple</Combobox.Item>
            <Combobox.Item value="b">Banana</Combobox.Item>
          </Combobox.Content>
        </Combobox.Root>
        <Field.Error />
      </Field.Root>
      <button>After</button>
    </>,
  );

  await user.type(screen.getByRole("combobox"), "Ban");
  await user.click(screen.getByRole("button", { name: "After" }));

  expect(screen.getByText("Pick Apple")).toBeInTheDocument();
});

const matchPassword = (value: string, formData: FormData) =>
  value !== formData.get("password") ? "Passwords do not match" : null;

const PasswordPair = ({ onSubmit }: { onSubmit?: () => void }) => (
  <form
    data-testid="form"
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.();
    }}
  >
    <Field.Root>
      <Field.Label>Password</Field.Label>
      <TextInput name="password" />
    </Field.Root>

    <Field.Root validate={matchPassword}>
      <Field.Label>Confirm</Field.Label>
      <TextInput name="confirm" />
      <Field.Error />
    </Field.Root>

    <button type="submit">Send</button>
  </form>
);

test("a cross-field rule rechecks when the other field changes", async () => {
  const user = userEvent.setup();

  render(<PasswordPair />);

  const form = screen.getByTestId("form") as HTMLFormElement;

  await user.type(screen.getByLabelText("Password"), "secret");
  await user.type(screen.getByLabelText("Confirm"), "secret");

  expect(form.checkValidity()).toBe(true);

  await user.type(screen.getByLabelText("Password"), "2");

  expect(form.checkValidity()).toBe(false);
});

test("a shown cross-field error follows the other field", async () => {
  const user = userEvent.setup();

  render(<PasswordPair />);

  await user.type(screen.getByLabelText("Password"), "secret");
  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(screen.getByText("Passwords do not match")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Confirm"), "secret");

  expect(screen.queryByText("Passwords do not match")).toBeNull();

  await user.type(screen.getByLabelText("Password"), "2");

  expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
});

test("a change elsewhere does not reveal an untouched field", async () => {
  const user = userEvent.setup();

  render(<PasswordPair />);

  await user.type(screen.getByLabelText("Password"), "secret");

  expect(
    (screen.getByLabelText("Confirm") as HTMLInputElement).validity.customError,
  ).toBe(true);
  expect(screen.queryByText("Passwords do not match")).toBeNull();
});

test("a submit attempt rechecks rules against values set without events", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<PasswordPair onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Password"), "secret");
  await user.type(screen.getByLabelText("Confirm"), "secret");
  await user.click(screen.getByLabelText("Password"));

  (screen.getByLabelText("Password") as HTMLInputElement).value = "other";

  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
});

test("removing validate clears the error it set", () => {
  const { rerender } = render(
    <Field.Root validate={() => "Always broken"}>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  expect(getInput().validity.customError).toBe(true);

  rerender(
    <Field.Root>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  expect(getInput().validity.customError).toBe(false);
});

test("a new validate applies without new input", () => {
  const { rerender } = render(
    <Field.Root validate={() => null}>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  expect(getInput().validity.customError).toBe(false);

  rerender(
    <Field.Root validate={() => "Now broken"}>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  expect(getInput().validationMessage).toBe("Now broken");
});

test("leaves a custom validity that validate did not set", () => {
  const { rerender } = render(
    <Field.Root>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  getInput().setCustomValidity("Set by hand");

  rerender(
    <Field.Root>
      <Field.Label>Username</Field.Label>
      <TextInput />
    </Field.Root>,
  );

  expect(getInput().validationMessage).toBe("Set by hand");
});

test("blur mode waits until focus leaves the whole PinInput", async () => {
  const user = userEvent.setup();

  render(
    <>
      <Field.Root required validationMode="blur" data-testid="field">
        <PinInput name="pin" length={3} />
      </Field.Root>
      <button>After</button>
    </>,
  );

  await user.click(screen.getAllByRole("textbox")[0]!);
  await user.keyboard("1");

  expect(screen.getAllByRole("textbox")[1]).toHaveFocus();
  expect(screen.getByTestId("field")).not.toHaveAttribute("data-invalid");

  await user.click(screen.getByRole("button", { name: "After" }));

  expect(screen.getByTestId("field")).toHaveAttribute("data-invalid");
});
