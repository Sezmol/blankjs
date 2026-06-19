import { render, screen, fireEvent } from "@testing-library/react";
import { Field } from "../field";
import { PasswordField } from "./password-field";

test("toggles password visibility on button click", () => {
  render(<PasswordField aria-label="Password" />);

  const input = screen.getByLabelText("Password");

  expect(input).toHaveAttribute("type", "password");

  fireEvent.click(screen.getByRole("button"));

  expect(input).toHaveAttribute("type", "text");

  fireEvent.click(screen.getByRole("button"));

  expect(input).toHaveAttribute("type", "password");
});

test("switches aria-label on toggle", () => {
  render(<PasswordField />);

  const toggle = screen.getByRole("button");

  expect(toggle).toHaveAttribute("aria-label", "Show password");

  fireEvent.click(toggle);

  expect(toggle).toHaveAttribute("aria-label", "Hide password");
});

test("disables both input and toggle when Field.Root is disabled", () => {
  render(
    <Field.Root disabled>
      <Field.Label>Password</Field.Label>
      <PasswordField />
    </Field.Root>,
  );

  const input = screen.getByLabelText("Password");
  const toggle = screen.getByRole("button");

  expect(input).toBeDisabled();
  expect(toggle).toBeDisabled();
});

test("disables both input and toggle when own disabled prop is set", () => {
  render(<PasswordField disabled aria-label="Password" />);

  const input = screen.getByLabelText("Password");
  const toggle = screen.getByRole("button");

  expect(input).toBeDisabled();
  expect(toggle).toBeDisabled();
});

test("does not break outside of Field", () => {
  render(<PasswordField aria-label="Password" />);

  const input = screen.getByLabelText("Password");

  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("type", "password");

  expect(screen.getByRole("button")).toBeInTheDocument();
});

test("does not submit the surrounding form when toggled", () => {
  const onSubmit = vi.fn((e) => e.preventDefault());

  render(
    <form onSubmit={onSubmit}>
      <PasswordField aria-label="Password" />
    </form>,
  );

  fireEvent.click(screen.getByRole("button", { name: /show password/i }));

  expect(onSubmit).not.toHaveBeenCalled();
});
