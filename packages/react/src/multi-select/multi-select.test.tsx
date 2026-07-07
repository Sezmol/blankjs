import { useState } from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiSelect } from "./index";

const fruits = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

const renderMultiSelect = (
  props: React.ComponentProps<typeof MultiSelect.Root> = {},
) =>
  render(
    <MultiSelect.Root {...props}>
      <MultiSelect.Trigger>
        <MultiSelect.Value placeholder="Pick fruits" />
      </MultiSelect.Trigger>
      <MultiSelect.Content>
        {fruits.map(({ value, label }) => (
          <MultiSelect.Item key={value} value={value}>
            {label}
          </MultiSelect.Item>
        ))}
      </MultiSelect.Content>
    </MultiSelect.Root>,
  );

const getTrigger = () => screen.getByRole("combobox");
const queryList = () => screen.queryByRole("listbox");
const getOption = (name: string) => screen.getByRole("option", { name });
const activeOption = () => {
  const id = getTrigger().getAttribute("aria-activedescendant");

  return id ? document.getElementById(id) : null;
};

test("opens a multiselectable listbox on trigger click", () => {
  renderMultiSelect();

  expect(queryList()).toBeNull();

  fireEvent.click(getTrigger());

  expect(screen.getByRole("listbox")).toHaveAttribute(
    "aria-multiselectable",
    "true",
  );
});

test("shows the placeholder when nothing is selected", () => {
  renderMultiSelect();

  expect(screen.getByText("Pick fruits")).toBeInTheDocument();
});

test("selecting an option keeps the listbox open", () => {
  renderMultiSelect();

  fireEvent.click(getTrigger());
  fireEvent.click(getOption("Banana"));

  expect(queryList()).toBeInTheDocument();
  expect(getOption("Banana")).toHaveAttribute("aria-selected", "true");
});

test("toggles options on and off, preserving selection order", () => {
  const onValueChange = vi.fn();

  renderMultiSelect({ onValueChange });

  fireEvent.click(getTrigger());
  fireEvent.click(getOption("Cherry"));
  fireEvent.click(getOption("Apple"));

  expect(onValueChange).toHaveBeenLastCalledWith(["c", "a"]);

  fireEvent.click(getOption("Cherry"));

  expect(onValueChange).toHaveBeenLastCalledWith(["a"]);
  expect(getOption("Cherry")).toHaveAttribute("aria-selected", "false");
});

test("renders selected values through the render prop", () => {
  render(
    <MultiSelect.Root defaultValue={["a", "c"]}>
      <MultiSelect.Trigger>
        <MultiSelect.Value placeholder="Pick fruits">
          {(values) => `${values.length} selected`}
        </MultiSelect.Value>
      </MultiSelect.Trigger>
      <MultiSelect.Content>
        {fruits.map(({ value, label }) => (
          <MultiSelect.Item key={value} value={value}>
            {label}
          </MultiSelect.Item>
        ))}
      </MultiSelect.Content>
    </MultiSelect.Root>,
  );

  expect(getTrigger()).toHaveTextContent("2 selected");
});

test("controlled: does not change without parent update", () => {
  const onValueChange = vi.fn();

  renderMultiSelect({ value: ["a"], onValueChange });

  fireEvent.click(getTrigger());
  fireEvent.click(getOption("Banana"));

  expect(onValueChange).toHaveBeenCalledWith(["a", "b"]);
  expect(getOption("Banana")).toHaveAttribute("aria-selected", "false");
  expect(getOption("Apple")).toHaveAttribute("aria-selected", "true");
});

test("Enter toggles the active option without closing", () => {
  renderMultiSelect();

  const trigger = getTrigger();

  fireEvent.click(trigger);

  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  fireEvent.keyDown(trigger, { key: "Enter" });

  expect(queryList()).toBeInTheDocument();

  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  fireEvent.keyDown(trigger, { key: "Enter" });

  expect(getOption("Banana")).toHaveAttribute("aria-selected", "true");
  expect(getOption("Cherry")).toHaveAttribute("aria-selected", "true");
});

test("highlights the first selected option on open", () => {
  renderMultiSelect({ defaultValue: ["b"] });

  fireEvent.click(getTrigger());

  expect(activeOption()).toHaveTextContent("Banana");
});

test("closes on Escape and outside press without losing selection", () => {
  const onValueChange = vi.fn();

  renderMultiSelect({ onValueChange });

  fireEvent.click(getTrigger());
  fireEvent.click(getOption("Apple"));

  fireEvent.keyDown(document, { key: "Escape" });

  expect(queryList()).toBeNull();
  expect(onValueChange).toHaveBeenCalledTimes(1);

  fireEvent.click(getTrigger());

  expect(getOption("Apple")).toHaveAttribute("aria-selected", "true");

  fireEvent.pointerDown(document.body);

  expect(queryList()).toBeNull();
});

test("submits every selected value through FormData", () => {
  render(
    <form aria-label="f">
      <MultiSelect.Root name="fruits" defaultValue={["a", "c"]}>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Pick fruits" />
        </MultiSelect.Trigger>
        <MultiSelect.Content>
          {fruits.map(({ value, label }) => (
            <MultiSelect.Item key={value} value={value}>
              {label}
            </MultiSelect.Item>
          ))}
        </MultiSelect.Content>
      </MultiSelect.Root>
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;

  expect(new FormData(form).getAll("fruits")).toEqual(["a", "c"]);
});

test("is absent from FormData when nothing is selected", () => {
  render(
    <form aria-label="f">
      <MultiSelect.Root name="fruits">
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Pick fruits" />
        </MultiSelect.Trigger>
        <MultiSelect.Content>
          {fruits.map(({ value, label }) => (
            <MultiSelect.Item key={value} value={value}>
              {label}
            </MultiSelect.Item>
          ))}
        </MultiSelect.Content>
      </MultiSelect.Root>
    </form>,
  );

  const form = screen.getByRole("form") as HTMLFormElement;

  expect(new FormData(form).has("fruits")).toBe(false);
});

test("form reset returns to defaultValue and survives a rerender", () => {
  function Harness() {
    const [, force] = useState(0);

    return (
      <form aria-label="f">
        <MultiSelect.Root name="fruits" defaultValue={["a"]}>
          <MultiSelect.Trigger>
            <MultiSelect.Value placeholder="Pick fruits" />
          </MultiSelect.Trigger>
          <MultiSelect.Content>
            {fruits.map(({ value, label }) => (
              <MultiSelect.Item key={value} value={value}>
                {label}
              </MultiSelect.Item>
            ))}
          </MultiSelect.Content>
        </MultiSelect.Root>
        <button type="button" onClick={() => force((n) => n + 1)}>
          rerender
        </button>
      </form>
    );
  }

  render(<Harness />);

  const form = screen.getByRole("form") as HTMLFormElement;

  fireEvent.click(getTrigger());
  fireEvent.click(getOption("Banana"));
  fireEvent.keyDown(document, { key: "Escape" });

  expect(new FormData(form).getAll("fruits")).toEqual(["a", "b"]);

  fireEvent.reset(form);

  expect(new FormData(form).getAll("fruits")).toEqual(["a"]);

  fireEvent.click(screen.getByText("rerender"));

  expect(new FormData(form).getAll("fruits")).toEqual(["a"]);
});

test("onClick veto (preventDefault) blocks the toggle", () => {
  const onValueChange = vi.fn();

  render(
    <MultiSelect.Root onValueChange={onValueChange}>
      <MultiSelect.Trigger>
        <MultiSelect.Value placeholder="Pick fruits" />
      </MultiSelect.Trigger>
      <MultiSelect.Content>
        <MultiSelect.Item value="a" onClick={(e) => e.preventDefault()}>
          Apple
        </MultiSelect.Item>
      </MultiSelect.Content>
    </MultiSelect.Root>,
  );

  fireEvent.click(getTrigger());
  fireEvent.click(getOption("Apple"));

  expect(onValueChange).not.toHaveBeenCalled();
  expect(getOption("Apple")).toHaveAttribute("aria-selected", "false");
});

test("marks Escape as handled when it closes the listbox", () => {
  renderMultiSelect();

  fireEvent.click(getTrigger());

  const notPrevented = fireEvent.keyDown(document, { key: "Escape" });

  expect(notPrevented).toBe(false);
  expect(queryList()).toBeNull();
});
