import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./index";
import { Field } from "../field";

const getTextarea = () => screen.getByRole("textbox") as HTMLTextAreaElement;

test("renders a textarea with the bk class and default rows", () => {
  render(<Textarea />);

  const textarea = getTextarea();

  expect(textarea).toHaveClass("bk-textarea");
  expect(textarea).toHaveAttribute("rows", "3");
});

test("user rows override the default", () => {
  render(<Textarea rows={7} />);

  expect(getTextarea()).toHaveAttribute("rows", "7");
});

test("passes value and onChange through untouched", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();

  render(<Textarea defaultValue="hi" onChange={onChange} />);

  const textarea = getTextarea();

  await user.type(textarea, "!");

  expect(textarea).toHaveValue("hi!");
  expect(onChange).toHaveBeenCalled();
});

test("inherits disabled, aria-invalid and label from Field", async () => {
  const user = userEvent.setup();

  const { rerender } = render(
    <Field.Root>
      <Field.Label>Bio</Field.Label>
      <Textarea />
    </Field.Root>,
  );

  const textarea = screen.getByRole("textbox", { name: "Bio" });

  await user.click(screen.getByText("Bio"));

  expect(textarea).toHaveFocus();

  rerender(
    <Field.Root disabled invalid>
      <Field.Label>Bio</Field.Label>
      <Textarea />
    </Field.Root>,
  );

  expect(textarea).toBeDisabled();
  expect(textarea).toHaveAttribute("aria-invalid", "true");
});

test("submits its value through FormData", () => {
  render(
    <form aria-label="f">
      <Textarea name="bio" defaultValue="hello" />
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;

  expect(new FormData(form).get("bio")).toBe("hello");
});

test("native form reset restores defaultValue", async () => {
  const user = userEvent.setup();

  render(
    <form aria-label="f">
      <Textarea name="bio" defaultValue="hello" />
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;
  const textarea = getTextarea();

  await user.clear(textarea);
  await user.type(textarea, "changed");

  expect(textarea).toHaveValue("changed");

  // fireEvent.reset only dispatches the event; form.reset() actually
  // restores field values in jsdom
  form.reset();

  expect(textarea).toHaveValue("hello");
});
