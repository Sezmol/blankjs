import { render, screen, fireEvent } from "@testing-library/react";
import { Field } from "../field";
import { SelectRoot } from "./root";
import { SelectTrigger } from "./trigger";

test("renders with role combobox", () => {
  render(
    <SelectRoot>
      <SelectTrigger>Open</SelectTrigger>
    </SelectRoot>,
  );

  expect(screen.getByRole("combobox")).toBeInTheDocument();
});

test("toggles aria-expanded on click", () => {
  render(
    <SelectRoot>
      <SelectTrigger>Open</SelectTrigger>
    </SelectRoot>,
  );

  const trigger = screen.getByRole("combobox");

  expect(trigger).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");

  fireEvent.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("omits aria-controls when closed and sets it when open", () => {
  render(
    <SelectRoot>
      <SelectTrigger>Open</SelectTrigger>
    </SelectRoot>,
  );

  const trigger = screen.getByRole("combobox");

  expect(trigger).not.toHaveAttribute("aria-controls");

  fireEvent.click(trigger);

  expect(trigger).toHaveAttribute("aria-controls");
});

test("marks the trigger disabled when Select.Root is disabled", () => {
  render(
    <SelectRoot disabled>
      <SelectTrigger>Open</SelectTrigger>
    </SelectRoot>,
  );

  const trigger = screen.getByRole("combobox");

  expect(trigger).toBeDisabled();
  expect(trigger).toHaveAttribute("aria-disabled", "true");
});

test("marks the trigger disabled when the wrapping Field.Root is disabled", () => {
  render(
    <Field.Root disabled>
      <SelectRoot>
        <SelectTrigger>Open</SelectTrigger>
      </SelectRoot>
    </Field.Root>,
  );

  expect(screen.getByRole("combobox")).toBeDisabled();
});

test("calls the user onClick on click", () => {
  const onClick = vi.fn();

  render(
    <SelectRoot>
      <SelectTrigger asChild>
        <div onClick={onClick}>Open</div>
      </SelectTrigger>
    </SelectRoot>,
  );

  const trigger = screen.getByRole("combobox");

  fireEvent.click(trigger);

  expect(onClick).toHaveBeenCalledTimes(1);
});

test("does not open when disabled (guard via asChild div)", () => {
  render(
    <SelectRoot disabled>
      <SelectTrigger asChild>
        <div>Open</div>
      </SelectTrigger>
    </SelectRoot>,
  );

  const trigger = screen.getByRole("combobox");

  fireEvent.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("renders a custom element via asChild with forwarded aria", () => {
  render(
    <SelectRoot>
      <SelectTrigger asChild>
        <div>Open</div>
      </SelectTrigger>
    </SelectRoot>,
  );

  const trigger = screen.getByRole("combobox");

  expect(trigger.tagName).toBe("DIV");

  expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
});
