import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "./index";

const renderSelect = (props = {}) =>
  render(
    <Select.Root {...props}>
      <Select.Trigger>
        <Select.Value placeholder="Pick one fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="a">Apple</Select.Item>
        <Select.Item value="b">Banana</Select.Item>
        <Select.Item value="c">Cherry</Select.Item>
      </Select.Content>
    </Select.Root>,
  );

test("opens the listbox on trigger click", () => {
  renderSelect();

  expect(screen.queryByRole("listbox")).toBeNull();

  fireEvent.click(screen.getByRole("combobox"));

  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

test("shows the placeholder when nothing is selected", () => {
  renderSelect();

  expect(screen.getByText("Pick one fruit")).toBeInTheDocument();
});

test("selects an option on click and closes the listbox", () => {
  renderSelect();

  fireEvent.click(screen.getByRole("combobox"));

  fireEvent.click(screen.getByRole("option", { name: "Banana" }));

  expect(screen.queryByRole("listbox")).toBeNull();
});

test("marks the chosen option as selected", () => {
  renderSelect();

  fireEvent.click(screen.getByRole("combobox"));

  fireEvent.click(screen.getByRole("option", { name: "Banana" }));

  fireEvent.click(screen.getByRole("combobox"));

  expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("displays the selected option's label in the trigger", () => {
  render(
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Pick one fruit">
          {(v) => ({ a: "Apple", b: "Banana", c: "Cherry" })[v]}
        </Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="a">Apple</Select.Item>
        <Select.Item value="b">Banana</Select.Item>
        <Select.Item value="c">Cherry</Select.Item>
      </Select.Content>
    </Select.Root>,
  );

  fireEvent.click(screen.getByRole("combobox"));

  fireEvent.click(screen.getByRole("option", { name: "Banana" }));

  expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
});

test("onClick veto (preventDefault) blocks the selection", () => {
  render(
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Pick one fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="a" onClick={(e) => e.preventDefault()}>
          Apple
        </Select.Item>
      </Select.Content>
    </Select.Root>,
  );

  fireEvent.click(screen.getByRole("combobox"));

  fireEvent.click(screen.getByRole("option", { name: "Apple" }));

  expect(screen.getByRole("listbox")).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute(
    "aria-selected",
    "false",
  );
});

test("closes on outside press", () => {
  renderSelect();

  fireEvent.click(screen.getByRole("combobox"));

  fireEvent.pointerDown(document.body);

  expect(screen.queryByRole("listbox")).toBeNull();
});

test("closes on Escape", () => {
  renderSelect();

  fireEvent.click(screen.getByRole("combobox"));

  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.queryByRole("listbox")).toBeNull();
});

test("ignores an already handled Escape", () => {
  renderSelect();

  fireEvent.click(screen.getByRole("combobox"));

  const onKeyDown = (e: KeyboardEvent) => e.preventDefault();
  document.addEventListener("keydown", onKeyDown, { capture: true });
  fireEvent.keyDown(document, { key: "Escape" });
  document.removeEventListener("keydown", onKeyDown, { capture: true });

  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

test("marks Escape as handled when it closes the listbox", () => {
  renderSelect();

  fireEvent.click(screen.getByRole("combobox"));

  const notPrevented = fireEvent.keyDown(document, { key: "Escape" });

  expect(notPrevented).toBe(false);
  expect(screen.queryByRole("listbox")).toBeNull();
});
