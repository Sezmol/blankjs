import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "./index";

const renderInForm = (rootProps = {}) =>
  render(
    <form data-testid="form">
      <Select.Root name="fruit" {...rootProps}>
        <Select.Trigger>
          <Select.Value placeholder="Pick one fruit" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Apple</Select.Item>
          <Select.Item value="b">Banana</Select.Item>
          <Select.Item value="c">Cherry</Select.Item>
        </Select.Content>
      </Select.Root>
      <button type="reset">Reset</button>
    </form>,
  );

const getHiddenInput = () =>
  document.querySelector<HTMLInputElement>('input[name="fruit"]');

test("renders a hidden input bound to the name prop", () => {
  renderInForm();

  const input = getHiddenInput();

  expect(input).not.toBeNull();
  expect(input).toHaveAttribute("aria-hidden", "true");
  expect(input).toHaveAttribute("tabindex", "-1");
  expect(input?.value).toBe("");
});

test("renders no hidden input without a name", () => {
  render(
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Pick one fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="a">Apple</Select.Item>
      </Select.Content>
    </Select.Root>,
  );

  expect(document.querySelector('input[type="hidden"]')).toBeNull();
});

test("mirrors the selected value into the hidden input", () => {
  renderInForm();

  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "Banana" }));

  expect(getHiddenInput()?.value).toBe("b");
});

test("exposes the value through native FormData", () => {
  renderInForm();

  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "Cherry" }));

  const formData = new FormData(
    screen.getByTestId("form") as HTMLFormElement,
  );

  expect(formData.get("fruit")).toBe("c");
});

test("form reset restores defaultValue", () => {
  renderInForm({ defaultValue: "a" });

  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "Banana" }));

  expect(getHiddenInput()?.value).toBe("b");

  fireEvent.click(screen.getByRole("button", { name: "Reset" }));

  expect(getHiddenInput()?.value).toBe("a");
  expect(screen.getByRole("combobox")).toHaveTextContent("a");
});

test("form reset clears the selection without defaultValue", () => {
  renderInForm();

  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "Banana" }));

  fireEvent.click(screen.getByRole("button", { name: "Reset" }));

  expect(getHiddenInput()?.value).toBe("");
  expect(screen.getByText("Pick one fruit")).toBeInTheDocument();
});

test("clicking the trigger inside a form does not submit it", () => {
  const onSubmit = vi.fn();

  render(
    <form onSubmit={onSubmit}>
      <Select.Root name="fruit">
        <Select.Trigger>
          <Select.Value placeholder="Pick one fruit" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Apple</Select.Item>
        </Select.Content>
      </Select.Root>
    </form>,
  );

  fireEvent.click(screen.getByRole("combobox"));

  expect(onSubmit).not.toHaveBeenCalled();
});

test("disabled select excludes its value from FormData", () => {
  renderInForm({ disabled: true, defaultValue: "a" });

  const formData = new FormData(
    screen.getByTestId("form") as HTMLFormElement,
  );

  expect(formData.get("fruit")).toBeNull();
});
