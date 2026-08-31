import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Form } from "./index";
import { Field } from "../field";
import { TextInput } from "../text-input";

const makeSchema = <T,>(
  validate: (
    value: unknown,
  ) => StandardSchemaV1.Result<T> | Promise<StandardSchemaV1.Result<T>>,
): StandardSchemaV1<unknown, T> => ({
  "~standard": { version: 1, vendor: "blankjs-test", validate },
});

const PasswordForm = ({
  schema,
  onSubmit,
  error,
}: {
  schema?: StandardSchemaV1;
  onSubmit?: () => void;
  error?: string;
}) => (
  <Form schema={schema!} onSubmit={onSubmit} error={error}>
    <Form.Error />
    <Field.Root name="password">
      <Field.Label>Password</Field.Label>
      <TextInput name="password" defaultValue="a" />
      <Field.Error />
    </Field.Root>
    <button type="submit">Go</button>
    <button type="reset">Reset</button>
  </Form>
);

test("renders nothing without a message", () => {
  render(<PasswordForm />);

  expect(screen.queryByRole("alert")).toBeNull();
});

test("shows a schema issue that names no field", async () => {
  const onSubmit = vi.fn();
  const schema = makeSchema(() => ({
    issues: [{ message: "Passwords must match" }],
  }));

  render(<PasswordForm schema={schema} onSubmit={onSubmit} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Passwords must match",
  );
  expect(onSubmit).not.toHaveBeenCalled();
});

test("an empty path counts as no path", async () => {
  const schema = makeSchema(() => ({
    issues: [{ message: "Form-level failure", path: [] }],
  }));

  render(<PasswordForm schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Form-level failure",
  );
});

test("field issues and a form issue land in their own places", async () => {
  const schema = makeSchema(() => ({
    issues: [
      { message: "Nothing adds up" },
      { message: "Too short", path: ["password"] },
    ],
  }));

  render(<PasswordForm schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Nothing adds up");
  expect(screen.getByText("Too short")).toBeInTheDocument();
});

test("the first form issue wins", async () => {
  const schema = makeSchema(() => ({
    issues: [{ message: "First" }, { message: "Second" }],
  }));

  render(<PasswordForm schema={schema} onSubmit={vi.fn()} />);

  expect(await screen.findByRole("button", { name: "Go" })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("First");
  expect(screen.queryByText("Second")).toBeNull();
});

test("the error prop shows without a schema", () => {
  render(<PasswordForm error="Card declined" />);

  expect(screen.getByRole("alert")).toHaveTextContent("Card declined");
});

test("the error prop wins over a schema issue", async () => {
  const schema = makeSchema(() => ({ issues: [{ message: "From schema" }] }));

  render(
    <PasswordForm schema={schema} onSubmit={vi.fn()} error="From server" />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("From server"),
  );
});

test("children override the message", () => {
  render(
    <Form error="Card declined">
      <Form.Error>Try another card</Form.Error>
    </Form>,
  );

  expect(screen.getByRole("alert")).toHaveTextContent("Try another card");
});

test("a passing submit clears the form error", async () => {
  let fail = true;

  const schema = makeSchema(() =>
    fail ? { issues: [{ message: "Nothing adds up" }] } : { value: {} },
  );

  render(<PasswordForm schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByRole("alert")).toBeInTheDocument();

  fail = false;

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
});

test("a reset clears the form error", async () => {
  const user = userEvent.setup();
  const schema = makeSchema(() => ({ issues: [{ message: "Nothing adds up" }] }));

  render(<PasswordForm schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByRole("alert")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Reset" }));

  expect(screen.queryByRole("alert")).toBeNull();
});

test("editing a field leaves the form error alone", async () => {
  const user = userEvent.setup();
  const schema = makeSchema(() => ({ issues: [{ message: "Nothing adds up" }] }));

  render(<PasswordForm schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByRole("alert")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Password"), "bcd");

  expect(screen.getByRole("alert")).toHaveTextContent("Nothing adds up");
});

test("an explicit role beats the default", () => {
  render(
    <Form error="Card declined">
      <Form.Error role="status" />
    </Form>,
  );

  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("Card declined");
});

test("outside a Form it renders only what it is given", () => {
  const { rerender } = render(<Form.Error />);

  expect(screen.queryByRole("alert")).toBeNull();

  rerender(<Form.Error>Standalone</Form.Error>);

  expect(screen.getByRole("alert")).toHaveTextContent("Standalone");
});

test("an id passes through", () => {
  render(
    <Form error="Card declined">
      <Form.Error id="checkout-error" />
      <button type="submit" aria-describedby="checkout-error">
        Pay
      </button>
    </Form>,
  );

  expect(screen.getByRole("alert")).toHaveAttribute("id", "checkout-error");
  expect(
    screen.getByRole("button", { name: "Pay" }),
  ).toHaveAccessibleDescription("Card declined");
});
