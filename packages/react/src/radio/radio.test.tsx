import { useState } from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup } from "./index";
import { Field } from "../field";

const fruits = ["apple", "banana", "cherry"];

const renderGroup = (
  rootProps: React.ComponentProps<typeof RadioGroup.Root> = {},
) =>
  render(
    <RadioGroup.Root {...rootProps}>
      {fruits.map((fruit) => (
        <RadioGroup.Item key={fruit} value={fruit} aria-label={fruit} />
      ))}
    </RadioGroup.Root>,
  );

const getRadio = (name: string) =>
  screen.getByRole("radio", { name }) as HTMLInputElement;

test("renders a radiogroup with radios", () => {
  renderGroup();

  expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  expect(screen.getAllByRole("radio")).toHaveLength(3);
});

test("selects on click and keeps the group mutually exclusive", async () => {
  const user = userEvent.setup();

  renderGroup();

  await user.click(getRadio("banana"));

  expect(getRadio("banana")).toBeChecked();

  await user.click(getRadio("cherry"));

  expect(getRadio("cherry")).toBeChecked();
  expect(getRadio("banana")).not.toBeChecked();
});

test("respects defaultValue", () => {
  renderGroup({ defaultValue: "banana" });

  expect(getRadio("banana")).toBeChecked();
});

test("calls onValueChange with the selected value", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  renderGroup({ onValueChange });

  await user.click(getRadio("cherry"));

  expect(onValueChange).toHaveBeenCalledTimes(1);
  expect(onValueChange).toHaveBeenCalledWith("cherry");
});

test("does not call onValueChange when the selected item is clicked again", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  renderGroup({ defaultValue: "apple", onValueChange });

  await user.click(getRadio("apple"));

  expect(onValueChange).not.toHaveBeenCalled();
});

test("controlled: does not change without parent update", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  renderGroup({ value: "apple", onValueChange });

  await user.click(getRadio("banana"));

  expect(onValueChange).toHaveBeenCalledWith("banana");
  expect(getRadio("apple")).toBeChecked();
});

test("controlled: follows the value prop", () => {
  const { rerender } = render(
    <RadioGroup.Root value="apple" onValueChange={() => {}}>
      {fruits.map((fruit) => (
        <RadioGroup.Item key={fruit} value={fruit} aria-label={fruit} />
      ))}
    </RadioGroup.Root>,
  );

  expect(getRadio("apple")).toBeChecked();

  rerender(
    <RadioGroup.Root value="cherry" onValueChange={() => {}}>
      {fruits.map((fruit) => (
        <RadioGroup.Item key={fruit} value={fruit} aria-label={fruit} />
      ))}
    </RadioGroup.Root>,
  );

  expect(getRadio("cherry")).toBeChecked();
  expect(getRadio("apple")).not.toBeChecked();
});

test("onChange veto (preventDefault) blocks the selection", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  render(
    <RadioGroup.Root onValueChange={onValueChange}>
      <RadioGroup.Item
        value="apple"
        aria-label="apple"
        onChange={(e) => e.preventDefault()}
      />
      <RadioGroup.Item value="banana" aria-label="banana" />
    </RadioGroup.Root>,
  );

  await user.click(getRadio("apple"));

  expect(onValueChange).not.toHaveBeenCalled();
});

test("shares a generated name across items when none is given", () => {
  renderGroup();

  const names = screen
    .getAllByRole("radio")
    .map((radio) => (radio as HTMLInputElement).name);

  expect(names[0]).toBeTruthy();
  expect(new Set(names).size).toBe(1);
});

test("uses the provided name", () => {
  renderGroup({ name: "fruit" });

  expect(getRadio("apple").name).toBe("fruit");
});

test("group disabled disables all items", () => {
  renderGroup({ disabled: true });

  for (const fruit of fruits) {
    expect(getRadio(fruit)).toBeDisabled();
  }
});

test("item disabled works on its own", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  render(
    <RadioGroup.Root onValueChange={onValueChange}>
      <RadioGroup.Item value="apple" aria-label="apple" disabled />
      <RadioGroup.Item value="banana" aria-label="banana" />
    </RadioGroup.Root>,
  );

  expect(getRadio("apple")).toBeDisabled();
  expect(getRadio("banana")).not.toBeDisabled();

  await user.click(getRadio("apple"));

  expect(onValueChange).not.toHaveBeenCalled();
});

test("inherits disabled and aria-invalid from Field", () => {
  render(
    <Field.Root disabled invalid>
      <RadioGroup.Root>
        <RadioGroup.Item value="apple" aria-label="apple" />
      </RadioGroup.Root>
    </Field.Root>,
  );

  expect(screen.getByRole("radiogroup")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(getRadio("apple")).toBeDisabled();
});

test("wraps itself in a label when given children", async () => {
  const user = userEvent.setup();

  render(
    <RadioGroup.Root>
      <RadioGroup.Item value="apple">Apple</RadioGroup.Item>
      <RadioGroup.Item value="banana">Banana</RadioGroup.Item>
    </RadioGroup.Root>,
  );

  const radio = screen.getByRole("radio", { name: "Apple" });

  expect(radio.closest("label")).toHaveClass("bk-radio-label");

  await user.click(screen.getByText("Apple"));

  expect(radio).toBeChecked();
});

test("routes className to the label wrapper when children are given", () => {
  render(
    <RadioGroup.Root>
      <RadioGroup.Item value="apple" className="custom">
        Apple
      </RadioGroup.Item>
    </RadioGroup.Root>,
  );

  const radio = screen.getByRole("radio", { name: "Apple" });

  expect(radio.closest("label")).toHaveClass("custom");
  expect(radio).not.toHaveClass("custom");
});

test("is labelled by Field.Label via aria-labelledby", () => {
  render(
    <Field.Root>
      <Field.Label>Fruit</Field.Label>
      <RadioGroup.Root>
        <RadioGroup.Item value="apple">Apple</RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>,
  );

  expect(
    screen.getByRole("radiogroup", { name: "Fruit" }),
  ).toBeInTheDocument();
});

test("Field.Label drops htmlFor next to a radiogroup", () => {
  render(
    <Field.Root>
      <Field.Label>Fruit</Field.Label>
      <RadioGroup.Root>
        <RadioGroup.Item value="apple">Apple</RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>,
  );

  expect(screen.getByText("Fruit")).not.toHaveAttribute("for");
});

test("submits the selected value through FormData", async () => {
  const user = userEvent.setup();

  render(
    <form aria-label="f">
      <RadioGroup.Root name="fruit">
        {fruits.map((fruit) => (
          <RadioGroup.Item key={fruit} value={fruit} aria-label={fruit} />
        ))}
      </RadioGroup.Root>
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;

  expect(new FormData(form).has("fruit")).toBe(false);

  await user.click(getRadio("banana"));

  expect(new FormData(form).get("fruit")).toBe("banana");
});

test("form reset returns to defaultValue and survives a rerender", () => {
  function Harness() {
    const [, force] = useState(0);

    return (
      <form aria-label="f">
        <RadioGroup.Root defaultValue="apple">
          {fruits.map((fruit) => (
            <RadioGroup.Item key={fruit} value={fruit} aria-label={fruit} />
          ))}
        </RadioGroup.Root>
        <button type="button" onClick={() => force((n) => n + 1)}>
          rerender
        </button>
      </form>
    );
  }

  render(<Harness />);

  const form = screen.getByRole("form") as HTMLFormElement;

  fireEvent.click(getRadio("cherry"));

  expect(getRadio("cherry")).toBeChecked();

  fireEvent.reset(form);

  expect(getRadio("apple")).toBeChecked();
  expect(getRadio("cherry")).not.toBeChecked();

  fireEvent.click(screen.getByText("rerender"));

  expect(getRadio("apple")).toBeChecked();
});
