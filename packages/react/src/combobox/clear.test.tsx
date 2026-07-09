import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./index";

const fruits = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

const Harness = (props: React.ComponentProps<typeof Combobox.Root>) => {
  const [inputValue, setInputValue] = useState(props.defaultInputValue ?? "");

  return (
    <form data-testid="form">
      <Combobox.Root
        name="fruit"
        {...props}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
      >
        <Combobox.Input placeholder="Pick a fruit" />
        <Combobox.Clear />
        <Combobox.Content>
          {fruits
            .filter(({ label }) =>
              label.toLowerCase().includes(inputValue.toLowerCase()),
            )
            .map(({ value, label }) => (
              <Combobox.Item key={value} value={value}>
                {label}
              </Combobox.Item>
            ))}
        </Combobox.Content>
      </Combobox.Root>
    </form>
  );
};

const getInput = () => screen.getByRole("combobox");
const queryClear = () => screen.queryByRole("button", { name: "Clear" });
const getHiddenInput = () =>
  document.querySelector<HTMLInputElement>('input[name="fruit"]');

const commitBanana = () => {
  fireEvent.click(getInput());
  fireEvent.pointerDown(screen.getByRole("option", { name: "Banana" }));
};

test("does not render without a committed value", () => {
  render(<Harness />);

  expect(queryClear()).toBeNull();
});

test("appears after committing an item", () => {
  render(<Harness />);

  commitBanana();

  expect(queryClear()).toBeInTheDocument();
});

test("clears the value and the input text", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  commitBanana();

  expect(getInput()).toHaveValue("Banana");

  await user.click(queryClear()!);

  expect(queryClear()).toBeNull();
  expect(getInput()).toHaveValue("");
});

test("clears the hidden input for FormData", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  commitBanana();

  expect(getHiddenInput()?.value).toBe("b");

  await user.click(queryClear()!);

  const formData = new FormData(
    screen.getByTestId("form") as HTMLFormElement,
  );

  expect(formData.get("fruit")).toBe("");
});

test("calls onValueChange with undefined", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  render(<Harness onValueChange={onValueChange} />);

  commitBanana();

  await user.click(queryClear()!);

  expect(onValueChange).toHaveBeenLastCalledWith(undefined);
});

test("moves focus back to the input", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  commitBanana();

  await user.click(queryClear()!);

  expect(getInput()).toHaveFocus();
});

test("does not revert to the committed label on the next blur", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  commitBanana();

  await user.click(queryClear()!);

  fireEvent.blur(getInput());

  expect(getInput()).toHaveValue("");
});

test("respects the onClick veto", async () => {
  const user = userEvent.setup();

  const VetoHarness = () => {
    const [inputValue, setInputValue] = useState("");

    return (
      <Combobox.Root
        defaultValue="b"
        inputValue={inputValue}
        onInputValueChange={setInputValue}
      >
        <Combobox.Input placeholder="Pick a fruit" />
        <Combobox.Clear onClick={(e) => e.preventDefault()} />
        <Combobox.Content>
          {fruits.map(({ value, label }) => (
            <Combobox.Item key={value} value={value}>
              {label}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Root>
    );
  };

  render(<VetoHarness />);

  await user.click(queryClear()!);

  expect(queryClear()).toBeInTheDocument();
});

test("does not render when the combobox is disabled", () => {
  render(<Harness defaultValue="b" disabled />);

  expect(queryClear()).toBeNull();
});
