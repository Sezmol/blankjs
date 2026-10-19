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

test("a reset clears schema errors from an earlier submit", async () => {
  const user = userEvent.setup();
  const schema = makeSchema(() => ({
    issues: [{ message: "Too short", path: ["username"] }],
  }));

  render(
    <Form schema={schema} onSubmit={vi.fn()}>
      <Field.Root name="username">
        <Field.Label>Username</Field.Label>
        <TextInput name="username" defaultValue="ann" />
        <Field.Error />
      </Field.Root>
      <button type="submit">Go</button>
      <button type="reset">Reset</button>
    </Form>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("Too short")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Reset" }));

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

test("a dismissed error stays hidden while the next submit is in flight", async () => {
  const user = userEvent.setup();

  let release: (() => void) | undefined;
  let calls = 0;

  const schema = makeSchema(async () => {
    calls += 1;

    if (calls === 1) {
      return { issues: [{ message: "Too short", path: ["username"] }] };
    }

    await new Promise<void>((resolve) => {
      release = resolve;
    });

    return { value: {} };
  });

  render(
    <Form schema={schema} onSubmit={vi.fn()}>
      <Field.Root name="username">
        <Field.Label>Username</Field.Label>
        <TextInput name="username" />
        <Field.Error />
      </Field.Root>
      <button type="submit">Go</button>
    </Form>,
  );

  await user.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("Too short")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Username"), "long enough");

  expect(screen.queryByText("Too short")).toBeNull();

  await user.click(screen.getByRole("button", { name: "Go" }));

  expect(screen.queryByText("Too short")).toBeNull();

  release?.();

  await waitFor(() => expect(calls).toBe(2));
  expect(screen.queryByText("Too short")).toBeNull();
});

const ActionForm = ({
  schema,
  action,
}: {
  schema: StandardSchemaV1;
  action: (data: FormData) => void;
}) => (
  <Form schema={schema} action={action}>
    <Field.Root name="username">
      <Field.Label>Username</Field.Label>
      <TextInput name="username" defaultValue="ann" />
      <Field.Error />
    </Field.Root>
    <button type="submit" name="intent" value="save">
      Go
    </button>
  </Form>
);

test("without onSubmit, a failing schema blocks the action", async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  const schema = makeSchema(() => ({
    issues: [{ message: "Too short", path: ["username"] }],
  }));

  render(<ActionForm schema={schema} action={action} />);

  await user.click(screen.getByRole("button", { name: "Go" }));

  expect(screen.getByText("Too short")).toBeInTheDocument();
  expect(screen.getByLabelText("Username")).toHaveFocus();
  expect(action).not.toHaveBeenCalled();
});

test("without onSubmit, a passing schema lets the action run with the submitter", async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  const schema = makeSchema((value) => ({ value }));

  render(<ActionForm schema={schema} action={action} />);

  await user.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() => expect(action).toHaveBeenCalledTimes(1));

  const data = action.mock.calls[0]![0] as FormData;

  expect(data.get("username")).toBe("ann");
  expect(data.get("intent")).toBe("save");
});

test("without onSubmit, an async schema blocks the submit and says why", async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const schema = makeSchema(async (value) => ({ value }));

  render(<ActionForm schema={schema} action={action} />);

  await user.click(screen.getByRole("button", { name: "Go" }));

  expect(action).not.toHaveBeenCalled();
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("an async schema needs onSubmit"),
  );

  error.mockRestore();
});

test("without onSubmit, a schema that throws blocks the submit", () => {
  const action = vi.fn();
  const schema = makeSchema(() => {
    throw new Error("Broken schema");
  });

  const reportError = vi.fn();

  vi.stubGlobal("reportError", reportError);

  render(<ActionForm schema={schema} action={action} />);

  const form = screen.getByRole("button", { name: "Go" }).closest("form")!;
  const e = new Event("submit", { bubbles: true, cancelable: true });

  fireEvent(form, e);

  vi.unstubAllGlobals();

  expect(e.defaultPrevented).toBe(true);
  expect(reportError).toHaveBeenCalledWith(new Error("Broken schema"));
  expect(action).not.toHaveBeenCalled();
});
