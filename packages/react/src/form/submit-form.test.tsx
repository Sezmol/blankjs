import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, submitForm } from "./index";
import { Field } from "../field";
import { TextInput } from "../text-input";

const SignUp = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => (
  <Form onSubmit={onSubmit} data-testid="form">
    <Field.Root required>
      <Field.Label>Email</Field.Label>
      <TextInput name="email" />
      <Field.Error />
    </Field.Root>

    <Field.Root
      validate={(value, formData) =>
        value !== formData.get("email") ? "Emails do not match" : null
      }
    >
      <Field.Label>Repeat email</Field.Label>
      <TextInput name="repeat" />
      <Field.Error />
    </Field.Root>

    <button type="button">Elsewhere</button>
    <button type="submit" name="intent" value="join">
      Join
    </button>
  </Form>
);

const form = () => screen.getByTestId("form") as HTMLFormElement;

const input = (label: string) =>
  screen.getByLabelText(label) as HTMLInputElement;

test("submitForm moves focus to the first invalid field", () => {
  const onSubmit = vi.fn();

  render(<SignUp onSubmit={onSubmit} />);

  screen.getByRole("button", { name: "Elsewhere" }).focus();

  submitForm(form());

  expect(input("Email")).toHaveFocus();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("submitForm reruns validate before the browser checks", () => {
  const onSubmit = vi.fn();

  render(<SignUp onSubmit={onSubmit} />);

  input("Email").value = "a@b.c";
  input("Repeat email").value = "a@b.c";

  submitForm(form());

  expect(onSubmit).toHaveBeenCalledTimes(1);

  input("Email").value = "x@y.z";

  submitForm(form());

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(input("Repeat email")).toHaveFocus();
});

test("submitForm passes the submitter on", () => {
  const onSubmit = vi.fn();

  render(<SignUp onSubmit={onSubmit} />);

  input("Email").value = "a@b.c";
  input("Repeat email").value = "a@b.c";

  submitForm(form(), screen.getByRole("button", { name: "Join" }));

  expect((onSubmit.mock.calls[0]![0] as FormData).get("intent")).toBe("join");
});

test("the attempt ends when submitForm returns", () => {
  render(<SignUp onSubmit={vi.fn()} />);

  input("Email").value = "a@b.c";
  input("Repeat email").value = "a@b.c";

  submitForm(form());

  const elsewhere = screen.getByRole("button", { name: "Elsewhere" });

  elsewhere.focus();
  input("Email").value = "";
  form().checkValidity();

  expect(elsewhere).toHaveFocus();
});

test("submitForm rechecks rules inside a click that started an attempt", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(
    <Form onSubmit={onSubmit}>
      <Field.Root required>
        <Field.Label>Email</Field.Label>
        <TextInput name="email" />
      </Field.Root>

      <Field.Root
        validate={(value, formData) =>
          value !== formData.get("email") ? "Emails do not match" : null
        }
      >
        <Field.Label>Repeat email</Field.Label>
        <TextInput name="repeat" />
      </Field.Root>

      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          input("Email").value = "x@y.z";
          submitForm(e.currentTarget.form!);
        }}
      >
        Save
      </button>
    </Form>,
  );

  await user.type(input("Email"), "a@b.c");
  await user.type(input("Repeat email"), "a@b.c");
  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(onSubmit).not.toHaveBeenCalled();
  expect(input("Repeat email")).toHaveFocus();
});

test("the attempt ends even when a rule throws", () => {
  let broken = false;

  render(
    <Form onSubmit={vi.fn()} data-testid="form">
      <Field.Root required>
        <Field.Label>Email</Field.Label>
        <TextInput name="email" defaultValue="a@b.c" />
      </Field.Root>

      <Field.Root
        validate={() => {
          if (broken) throw new Error("Broken rule");

          return null;
        }}
      >
        <Field.Label>Nickname</Field.Label>
        <TextInput name="nickname" />
      </Field.Root>

      <button type="button">Elsewhere</button>
    </Form>,
  );

  broken = true;

  expect(() => submitForm(form())).toThrow("Broken rule");

  broken = false;

  const elsewhere = screen.getByRole("button", { name: "Elsewhere" });

  elsewhere.focus();
  input("Email").value = "";
  form().checkValidity();

  expect(elsewhere).toHaveFocus();
});
