import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelect } from "./index";

const renderMultiSelect = (rootProps = {}) =>
  render(
    <form data-testid="form">
      <MultiSelect.Root name="fruits" {...rootProps}>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Pick fruits" />
        </MultiSelect.Trigger>
        <MultiSelect.Clear />
        <MultiSelect.Content>
          <MultiSelect.Item value="a">Apple</MultiSelect.Item>
          <MultiSelect.Item value="b">Banana</MultiSelect.Item>
        </MultiSelect.Content>
      </MultiSelect.Root>
    </form>,
  );

const queryClear = () => screen.queryByRole("button", { name: "Clear" });

test("does not render without selected values", () => {
  renderMultiSelect();

  expect(queryClear()).toBeNull();
});

test("renders when values are selected", () => {
  renderMultiSelect({ defaultValue: ["a"] });

  expect(queryClear()).toBeInTheDocument();
});

test("appears after selecting an item", () => {
  renderMultiSelect();

  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "Banana" }));

  expect(queryClear()).toBeInTheDocument();
});

test("clears all values and disappears", async () => {
  const user = userEvent.setup();

  renderMultiSelect({ defaultValue: ["a", "b"] });

  await user.click(queryClear()!);

  expect(queryClear()).toBeNull();
  expect(screen.getByText("Pick fruits")).toBeInTheDocument();
});

test("removes the values from FormData", async () => {
  const user = userEvent.setup();

  renderMultiSelect({ defaultValue: ["a", "b"] });

  await user.click(queryClear()!);

  const formData = new FormData(
    screen.getByTestId("form") as HTMLFormElement,
  );

  expect(formData.getAll("fruits")).toEqual([]);
});

test("calls onValueChange with an empty array", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  renderMultiSelect({ defaultValue: ["a"], onValueChange });

  await user.click(queryClear()!);

  expect(onValueChange).toHaveBeenCalledWith([]);
});

test("moves focus back to the trigger", async () => {
  const user = userEvent.setup();

  renderMultiSelect({ defaultValue: ["a"] });

  await user.click(queryClear()!);

  expect(screen.getByRole("combobox")).toHaveFocus();
});

test("respects the onClick veto", async () => {
  const user = userEvent.setup();

  render(
    <MultiSelect.Root defaultValue={["a"]}>
      <MultiSelect.Trigger>
        <MultiSelect.Value placeholder="Pick fruits" />
      </MultiSelect.Trigger>
      <MultiSelect.Clear onClick={(e) => e.preventDefault()} />
      <MultiSelect.Content>
        <MultiSelect.Item value="a">Apple</MultiSelect.Item>
      </MultiSelect.Content>
    </MultiSelect.Root>,
  );

  await user.click(queryClear()!);

  expect(queryClear()).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toHaveTextContent("a");
});

test("does not render when the multi select is disabled", () => {
  renderMultiSelect({ defaultValue: ["a"], disabled: true });

  expect(queryClear()).toBeNull();
});
