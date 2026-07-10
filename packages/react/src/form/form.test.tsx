import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "./index";
import { serialize } from "./serialize";
import { Field } from "../field";
import { TextInput } from "../text-input";

test("calls onSubmit with FormData and prevents the default submit", () => {
  const onSubmit = vi.fn();

  render(
    <Form onSubmit={onSubmit} data-testid="form">
      <TextInput name="name" defaultValue="Ann" />
      <button type="submit">Go</button>
    </Form>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(onSubmit).toHaveBeenCalledTimes(1);

  const [data, event] = onSubmit.mock.calls[0]!;

  expect(data).toBeInstanceOf(FormData);
  expect(data.get("name")).toBe("Ann");
  expect(event.defaultPrevented).toBe(true);
});

test("does not prevent the default submit without onSubmit", () => {
  render(
    <Form data-testid="form">
      <TextInput name="name" />
    </Form>,
  );

  const form = screen.getByTestId("form") as HTMLFormElement;
  const e = new Event("submit", { bubbles: true, cancelable: true });

  form.dispatchEvent(e);

  expect(e.defaultPrevented).toBe(false);
});

test("focuses the first invalid control", () => {
  render(
    <Form>
      <Field.Root required>
        <Field.Label>First</Field.Label>
        <TextInput name="first" />
      </Field.Root>
      <Field.Root required>
        <Field.Label>Second</Field.Label>
        <TextInput name="second" />
      </Field.Root>
    </Form>,
  );

  fireEvent.invalid(screen.getByLabelText("First"));
  fireEvent.invalid(screen.getByLabelText("Second"));

  expect(screen.getByLabelText("First")).toHaveFocus();
});

const ServerErrorHarness = () => {
  const [errors, setErrors] = useState<Record<string, string>>();

  return (
    <Form errors={errors} data-testid="form">
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <TextInput name="email" />
        <Field.Error />
      </Field.Root>
      <button
        type="button"
        onClick={() => setErrors({ email: "Already taken" })}
      >
        Fail
      </button>
    </Form>
  );
};

test("shows a server error for the matching field", () => {
  render(<ServerErrorHarness />);

  expect(screen.queryByText("Already taken")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Fail" }));

  expect(screen.getByText("Already taken")).toBeInTheDocument();
  expect(screen.getByLabelText("Email")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("dismisses the server error once the field changes", async () => {
  const user = userEvent.setup();

  render(<ServerErrorHarness />);

  fireEvent.click(screen.getByRole("button", { name: "Fail" }));

  expect(screen.getByText("Already taken")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Email"), "a");

  expect(screen.queryByText("Already taken")).toBeNull();
});

test("re-shows the same server error after the next submit", async () => {
  const user = userEvent.setup();

  render(<ServerErrorHarness />);

  fireEvent.click(screen.getByRole("button", { name: "Fail" }));
  await user.type(screen.getByLabelText("Email"), "a");

  expect(screen.queryByText("Already taken")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Fail" }));

  expect(screen.getByText("Already taken")).toBeInTheDocument();
});

test("fields without a matching error stay valid", () => {
  render(
    <Form errors={{ email: "Already taken" }}>
      <Field.Root name="login">
        <Field.Label>Login</Field.Label>
        <TextInput name="login" />
        <Field.Error />
      </Field.Root>
    </Form>,
  );

  expect(screen.queryByText("Already taken")).toBeNull();
  expect(screen.getByLabelText("Login")).not.toHaveAttribute("aria-invalid");
});

describe("serialize", () => {
  test("maps single keys to values and repeated keys to arrays", () => {
    const data = new FormData();

    data.append("name", "Ann");
    data.append("visited", "AU");
    data.append("visited", "AT");

    expect(serialize(data)).toEqual({
      name: "Ann",
      visited: ["AU", "AT"],
    });
  });

  test("keeps File values intact", () => {
    const data = new FormData();
    const file = new File(["hi"], "hi.txt", { type: "text/plain" });

    data.append("doc", file);

    expect(serialize(data).doc).toBe(file);
  });

  test("returns an empty object for an empty form", () => {
    expect(serialize(new FormData())).toEqual({});
  });
});
