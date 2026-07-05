import { useState } from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./index";
import { Field } from "../field";

const getCheckbox = () => screen.getByRole("checkbox") as HTMLInputElement;

test("toggles on click (uncontrolled)", async () => {
  const user = userEvent.setup();

  render(<Checkbox />);

  const cb = getCheckbox();

  expect(cb).not.toBeChecked();

  await user.click(cb);

  expect(cb).toBeChecked();

  await user.click(cb);

  expect(cb).not.toBeChecked();
});

test("toggles on Space", async () => {
  const user = userEvent.setup();

  render(<Checkbox />);

  const cb = getCheckbox();

  cb.focus();

  await user.keyboard(" ");

  expect(cb).toBeChecked();

  await user.keyboard(" ");

  expect(cb).not.toBeChecked();
});

test("respects defaultChecked", () => {
  render(<Checkbox defaultChecked />);

  expect(getCheckbox()).toBeChecked();
});

test("calls onCheckedChange with the next state", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();

  render(<Checkbox onCheckedChange={onCheckedChange} />);

  await user.click(getCheckbox());

  expect(onCheckedChange).toHaveBeenCalledTimes(1);
  expect(onCheckedChange).toHaveBeenLastCalledWith(true);

  await user.click(getCheckbox());

  expect(onCheckedChange).toHaveBeenCalledTimes(2);
  expect(onCheckedChange).toHaveBeenLastCalledWith(false);
});

test("controlled: does not change without parent update", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();

  render(<Checkbox checked={false} onCheckedChange={onCheckedChange} />);

  const cb = getCheckbox();

  await user.click(cb);

  expect(onCheckedChange).toHaveBeenCalledWith(true);
  expect(cb).not.toBeChecked();
});

test("controlled: follows the checked prop", () => {
  const { rerender } = render(
    <Checkbox checked={false} onCheckedChange={() => {}} />,
  );

  expect(getCheckbox()).not.toBeChecked();

  rerender(<Checkbox checked onCheckedChange={() => {}} />);

  expect(getCheckbox()).toBeChecked();

  rerender(<Checkbox checked={false} onCheckedChange={() => {}} />);

  expect(getCheckbox()).not.toBeChecked();
});

test("onChange veto (preventDefault) blocks the state change", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();

  const { rerender } = render(
    <Checkbox
      onChange={(e) => e.preventDefault()}
      onCheckedChange={onCheckedChange}
    />,
  );

  const cb = getCheckbox();

  await user.click(cb);

  // jsdom "cancels" a click by re-toggling instead of restoring the pre-click
  // state (real browsers restore it), so force a commit and let React
  // re-impose the controlled value before asserting the DOM
  rerender(
    <Checkbox
      data-sync
      onChange={(e) => e.preventDefault()}
      onCheckedChange={onCheckedChange}
    />,
  );

  expect(cb).not.toBeChecked();
  expect(onCheckedChange).not.toHaveBeenCalled();
});

test("indeterminate sets the DOM property and clears on toggle prop change", () => {
  const { rerender } = render(<Checkbox indeterminate />);
  const cb = getCheckbox();

  expect(cb.indeterminate).toBe(true);
  expect(cb).not.toBeChecked();

  rerender(<Checkbox indeterminate={false} />);

  expect(cb.indeterminate).toBe(false);
});

test("does not toggle when disabled", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();

  render(<Checkbox disabled onCheckedChange={onCheckedChange} />);

  const cb = getCheckbox();

  expect(cb).toBeDisabled();

  await user.click(cb);

  expect(cb).not.toBeChecked();
  expect(onCheckedChange).not.toHaveBeenCalled();
});

test("inherits disabled and aria-invalid from Field", () => {
  render(
    <Field.Root disabled invalid>
      <Checkbox />
    </Field.Root>,
  );

  const cb = getCheckbox();

  expect(cb).toBeDisabled();
  expect(cb).toHaveAttribute("aria-invalid", "true");
});

test("label click toggles via Field htmlFor", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root>
      <Field.Label>Согласен</Field.Label>
      <Checkbox />
    </Field.Root>,
  );

  const cb = getCheckbox();

  expect(cb).not.toBeChecked();

  await user.click(screen.getByText("Согласен"));

  expect(cb).toBeChecked();
});

test("submits its value through FormData when checked", () => {
  render(
    <form aria-label="f">
      <Checkbox name="agree" value="yes" defaultChecked />
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;

  const data = new FormData(form);

  expect(data.get("agree")).toBe("yes");
});

test("is absent from FormData when unchecked", () => {
  render(
    <form aria-label="f">
      <Checkbox name="agree" value="yes" />
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;

  const data = new FormData(form);

  expect(data.has("agree")).toBe(false);
});

test("form reset returns to defaultChecked and survives a rerender", () => {
  function Harness() {
    const [, force] = useState(0);

    return (
      <form aria-label="f">
        <Checkbox name="agree" value="yes" />
        <button type="button" onClick={() => force((n) => n + 1)}>
          rerender
        </button>
      </form>
    );
  }

  render(<Harness />);

  const cb = getCheckbox();
  const form = screen.getByRole("form") as HTMLFormElement;

  fireEvent.click(cb);

  expect(cb).toBeChecked();

  fireEvent.reset(form);

  expect(cb).not.toBeChecked();

  fireEvent.click(screen.getByText("rerender"));

  expect(cb).not.toBeChecked();
});
