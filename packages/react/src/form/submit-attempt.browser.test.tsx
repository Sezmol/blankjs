import type { MouseEvent } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Field } from "../field";
import { TextInput } from "../text-input";
import "../styles.css";

const TwoRequired = ({
  onClick,
}: {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) => (
  <form data-testid="form" onSubmit={(e) => e.preventDefault()}>
    <Field.Root required>
      <Field.Label>First</Field.Label>
      <TextInput name="first" />
    </Field.Root>

    <Field.Root required>
      <Field.Label>Second</Field.Label>
      <TextInput name="second" />
    </Field.Root>

    <button type="submit" onClick={onClick}>
      Send
    </button>
  </form>
);

const input = (label: string) => screen.getByLabelText(label);

const form = () => screen.getByTestId("form") as HTMLFormElement;

const nextTask = () => new Promise((resolve) => setTimeout(resolve, 50));

test("stopPropagation in the submit click still focuses the first invalid field", async () => {
  render(<TwoRequired onClick={(e) => e.stopPropagation()} />);

  await userEvent.click(screen.getByRole("button", { name: "Send" }));

  await expect.poll(() => document.activeElement).toBe(input("First"));
});

test("Enter on an invalid form focuses the first invalid field", async () => {
  render(<TwoRequired />);

  await userEvent.click(input("Second"));
  await userEvent.keyboard("{Enter}");

  await expect.poll(() => document.activeElement).toBe(input("First"));
});

test("Enter whose implicit submit click is canceled leaves focus alone", async () => {
  render(
    <TwoRequired
      onClick={(e) => {
        e.preventDefault();
        form().checkValidity();
      }}
    />,
  );

  await userEvent.click(input("Second"));
  await userEvent.keyboard("{Enter}");
  await nextTask();

  expect(document.activeElement).toBe(input("Second"));
});
