import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./index";

const renderSelect = (rootProps = {}) =>
  render(
    <form data-testid="form">
      <Select.Root name="fruit" {...rootProps}>
        <Select.Trigger>
          <Select.Value placeholder="Pick one fruit" />
        </Select.Trigger>
        <Select.Clear />
        <Select.Content>
          <Select.Item value="a">Apple</Select.Item>
          <Select.Item value="b">Banana</Select.Item>
        </Select.Content>
      </Select.Root>
    </form>,
  );

const queryClear = () => screen.queryByRole("button", { name: "Clear" });
const getHiddenInput = () =>
  document.querySelector<HTMLInputElement>('input[name="fruit"]');

test("does not render without a value", () => {
  renderSelect();

  expect(queryClear()).toBeNull();
});

test("renders when a value is set", () => {
  renderSelect({ defaultValue: "a" });

  expect(queryClear()).toBeInTheDocument();
});

test("appears after selecting an item", () => {
  renderSelect();

  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "Banana" }));

  expect(queryClear()).toBeInTheDocument();
});

test("clears the value and disappears", async () => {
  const user = userEvent.setup();

  renderSelect({ defaultValue: "a" });

  await user.click(queryClear()!);

  expect(queryClear()).toBeNull();
  expect(screen.getByText("Pick one fruit")).toBeInTheDocument();
});

test("clears the hidden input for FormData", async () => {
  const user = userEvent.setup();

  renderSelect({ defaultValue: "a" });

  expect(getHiddenInput()?.value).toBe("a");

  await user.click(queryClear()!);

  const formData = new FormData(
    screen.getByTestId("form") as HTMLFormElement,
  );

  expect(formData.get("fruit")).toBe("");
});

test("calls onValueChange with undefined", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  renderSelect({ defaultValue: "a", onValueChange });

  await user.click(queryClear()!);

  expect(onValueChange).toHaveBeenCalledWith(undefined);
});

test("moves focus back to the trigger", async () => {
  const user = userEvent.setup();

  renderSelect({ defaultValue: "a" });

  await user.click(queryClear()!);

  expect(screen.getByRole("combobox")).toHaveFocus();
});

test("respects the onClick veto", async () => {
  const user = userEvent.setup();

  render(
    <Select.Root defaultValue="a">
      <Select.Trigger>
        <Select.Value placeholder="Pick one fruit" />
      </Select.Trigger>
      <Select.Clear onClick={(e) => e.preventDefault()} />
      <Select.Content>
        <Select.Item value="a">Apple</Select.Item>
      </Select.Content>
    </Select.Root>,
  );

  await user.click(queryClear()!);

  expect(queryClear()).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toHaveTextContent("a");
});

test("does not render when the select is disabled", () => {
  renderSelect({ defaultValue: "a", disabled: true });

  expect(queryClear()).toBeNull();
});

test("renders custom children instead of the default icon", () => {
  render(
    <Select.Root defaultValue="a">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Clear>Reset choice</Select.Clear>
      <Select.Content>
        <Select.Item value="a">Apple</Select.Item>
      </Select.Content>
    </Select.Root>,
  );

  expect(
    screen.getByRole("button", { name: "Clear" }),
  ).toHaveTextContent("Reset choice");
});
