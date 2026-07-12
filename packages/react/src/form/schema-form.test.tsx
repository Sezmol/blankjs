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

const UsernameForm = ({
  schema,
  onSubmit,
  errors,
}: {
  schema: StandardSchemaV1;
  onSubmit?: (data: unknown) => void;
  errors?: Record<string, string>;
}) => (
  <Form schema={schema} onSubmit={onSubmit} errors={errors}>
    <Field.Root name="username">
      <Field.Label>Username</Field.Label>
      <TextInput name="username" defaultValue="ann" />
      <Field.Error />
    </Field.Root>
    <button type="submit">Go</button>
  </Form>
);

test("passes the parsed schema output to onSubmit instead of FormData", async () => {
  const onSubmit = vi.fn();
  const schema = makeSchema((value) => ({
    value: { ...(value as object), parsed: true },
  }));

  render(<UsernameForm schema={schema} onSubmit={onSubmit} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

  expect(onSubmit.mock.calls[0]![0]).toEqual({
    username: "ann",
    parsed: true,
  });
});

test("shows issue messages on the matching field and skips onSubmit", async () => {
  const onSubmit = vi.fn();
  const schema = makeSchema(() => ({
    issues: [{ message: "Too short", path: ["username"] }],
  }));

  render(<UsernameForm schema={schema} onSubmit={onSubmit} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("Too short")).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByLabelText("Username")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("supports object path segments and keeps the first issue per field", async () => {
  const schema = makeSchema(() => ({
    issues: [
      { message: "First", path: [{ key: "username" }] },
      { message: "Second", path: ["username"] },
    ],
  }));

  render(<UsernameForm schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("First")).toBeInTheDocument();
  expect(screen.queryByText("Second")).toBeNull();
});

test("ignores issues without a path", async () => {
  const onSubmit = vi.fn();
  const schema = makeSchema(() => ({
    issues: [{ message: "Form-level failure" }],
  }));

  render(<UsernameForm schema={schema} onSubmit={onSubmit} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
  expect(screen.queryByText("Form-level failure")).toBeNull();
});

test("awaits an async validate", async () => {
  const onSubmit = vi.fn();
  const schema = makeSchema(async (value) => ({
    value: value as Record<string, unknown>,
  }));

  render(<UsernameForm schema={schema} onSubmit={onSubmit} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
});

test("errors prop wins over a schema error on the same field", async () => {
  const schema = makeSchema(() => ({
    issues: [{ message: "Too short", path: ["username"] }],
  }));

  render(
    <UsernameForm schema={schema} errors={{ username: "Already taken" }} />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() =>
    expect(screen.getByText("Already taken")).toBeInTheDocument(),
  );
  expect(screen.queryByText("Too short")).toBeNull();
});

test("editing the field dismisses its schema error", async () => {
  const user = userEvent.setup();
  const schema = makeSchema(() => ({
    issues: [{ message: "Too short", path: ["username"] }],
  }));

  render(<UsernameForm schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("Too short")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Username"), "a");

  expect(screen.queryByText("Too short")).toBeNull();
});

test("focuses the first invalid control in DOM order, not issue order", async () => {
  const schema = makeSchema(() => ({
    issues: [
      { message: "B bad", path: ["b"] },
      { message: "A bad", path: ["a"] },
    ],
  }));

  render(
    <Form schema={schema} onSubmit={vi.fn()}>
      <Field.Root name="a">
        <Field.Label>A</Field.Label>
        <TextInput name="a" />
        <Field.Error />
      </Field.Root>
      <Field.Root name="b">
        <Field.Label>B</Field.Label>
        <TextInput name="b" />
        <Field.Error />
      </Field.Root>
      <button type="submit">Go</button>
    </Form>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  await screen.findByText("A bad");

  expect(screen.getByLabelText("A")).toHaveFocus();
});

test("types: onSubmit receives the inferred schema output", () => {
  const schema = makeSchema<{ age: number }>(() => ({ value: { age: 30 } }));

  render(
    <Form
      schema={schema}
      onSubmit={(data) => {
        data satisfies { age: number };
        // @ts-expect-error data is the parsed output, not FormData
        data.get("age");
      }}
    />,
  );
});

test("types: without a schema onSubmit still receives FormData", () => {
  render(
    <Form
      onSubmit={(data) => {
        data satisfies FormData;
      }}
    />,
  );
});
