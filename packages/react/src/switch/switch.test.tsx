import { useState } from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./index";
import { Field } from "../field";

const getSwitch = () => screen.getByRole("switch") as HTMLInputElement;

test("renders with role switch", () => {
  render(<Switch />);

  expect(getSwitch()).toBeInTheDocument();
});

test("toggles on click (uncontrolled)", async () => {
  const user = userEvent.setup();

  render(<Switch />);

  const sw = getSwitch();

  expect(sw).not.toBeChecked();

  await user.click(sw);

  expect(sw).toBeChecked();

  await user.click(sw);

  expect(sw).not.toBeChecked();
});

test("toggles on Space", async () => {
  const user = userEvent.setup();

  render(<Switch />);

  const sw = getSwitch();

  sw.focus();

  await user.keyboard(" ");

  expect(sw).toBeChecked();

  await user.keyboard(" ");

  expect(sw).not.toBeChecked();
});

test("respects defaultChecked", () => {
  render(<Switch defaultChecked />);

  expect(getSwitch()).toBeChecked();
});

test("calls onCheckedChange with the next state", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();

  render(<Switch onCheckedChange={onCheckedChange} />);

  await user.click(getSwitch());

  expect(onCheckedChange).toHaveBeenCalledTimes(1);
  expect(onCheckedChange).toHaveBeenLastCalledWith(true);

  await user.click(getSwitch());

  expect(onCheckedChange).toHaveBeenCalledTimes(2);
  expect(onCheckedChange).toHaveBeenLastCalledWith(false);
});

test("controlled: does not change without parent update", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();

  render(<Switch checked={false} onCheckedChange={onCheckedChange} />);

  const sw = getSwitch();

  await user.click(sw);

  expect(onCheckedChange).toHaveBeenCalledWith(true);
  expect(sw).not.toBeChecked();
});

test("controlled: follows the checked prop", () => {
  const { rerender } = render(
    <Switch checked={false} onCheckedChange={() => {}} />,
  );

  expect(getSwitch()).not.toBeChecked();

  rerender(<Switch checked onCheckedChange={() => {}} />);

  expect(getSwitch()).toBeChecked();

  rerender(<Switch checked={false} onCheckedChange={() => {}} />);

  expect(getSwitch()).not.toBeChecked();
});

test("onChange veto (preventDefault) blocks the state change", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();

  const { rerender } = render(
    <Switch
      onChange={(e) => e.preventDefault()}
      onCheckedChange={onCheckedChange}
    />,
  );

  const sw = getSwitch();

  await user.click(sw);

  // jsdom "cancels" a click by re-toggling instead of restoring the pre-click
  // state (real browsers restore it), so force a commit and let React
  // re-impose the controlled value before asserting the DOM
  rerender(
    <Switch
      data-sync
      onChange={(e) => e.preventDefault()}
      onCheckedChange={onCheckedChange}
    />,
  );

  expect(sw).not.toBeChecked();
  expect(onCheckedChange).not.toHaveBeenCalled();
});

test("does not toggle when disabled", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();

  render(<Switch disabled onCheckedChange={onCheckedChange} />);

  const sw = getSwitch();

  expect(sw).toBeDisabled();

  await user.click(sw);

  expect(sw).not.toBeChecked();
  expect(onCheckedChange).not.toHaveBeenCalled();
});

test("inherits disabled and aria-invalid from Field", () => {
  render(
    <Field.Root disabled invalid>
      <Switch />
    </Field.Root>,
  );

  const sw = getSwitch();

  expect(sw).toBeDisabled();
  expect(sw).toHaveAttribute("aria-invalid", "true");
});

test("label click toggles via Field htmlFor", async () => {
  const user = userEvent.setup();

  render(
    <Field.Root>
      <Field.Label>Notifications</Field.Label>
      <Switch />
    </Field.Root>,
  );

  const sw = getSwitch();

  expect(sw).not.toBeChecked();

  await user.click(screen.getByText("Notifications"));

  expect(sw).toBeChecked();
});

test("submits its value through FormData when checked", () => {
  render(
    <form aria-label="f">
      <Switch name="notify" value="on" defaultChecked />
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;

  const data = new FormData(form);

  expect(data.get("notify")).toBe("on");
});

test("is absent from FormData when unchecked", () => {
  render(
    <form aria-label="f">
      <Switch name="notify" value="on" />
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;

  const data = new FormData(form);

  expect(data.has("notify")).toBe(false);
});

test("form reset returns to defaultChecked and survives a rerender", () => {
  function Harness() {
    const [, force] = useState(0);

    return (
      <form aria-label="f">
        <Switch name="notify" value="on" />
        <button type="button" onClick={() => force((n) => n + 1)}>
          rerender
        </button>
      </form>
    );
  }

  render(<Harness />);

  const sw = getSwitch();
  const form = screen.getByRole("form") as HTMLFormElement;

  fireEvent.click(sw);

  expect(sw).toBeChecked();

  fireEvent.reset(form);

  expect(sw).not.toBeChecked();

  fireEvent.click(screen.getByText("rerender"));

  expect(sw).not.toBeChecked();
});
