import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./index";

const fruits = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

const FormHarness = (props: React.ComponentProps<typeof Combobox.Root>) => {
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
      <button type="reset">Reset</button>
    </form>
  );
};

const getInput = () => screen.getByRole("combobox");
const queryList = () => screen.queryByRole("listbox");
const getForm = () => screen.getByTestId("form") as HTMLFormElement;
const getHiddenInput = () =>
  document.querySelector<HTMLInputElement>('input[name="fruit"]');

const NoNameHarness = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <form data-testid="form">
      <Combobox.Root inputValue={inputValue} onInputValueChange={setInputValue}>
        <Combobox.Input placeholder="Pick a fruit" />
        <Combobox.Content>
          {fruits.map(({ value, label }) => (
            <Combobox.Item key={value} value={value}>
              {label}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Root>
    </form>
  );
};

test("renders a hidden input bound to the name prop", () => {
  render(<FormHarness />);

  const hidden = getHiddenInput();

  expect(hidden).toBeInTheDocument();
  expect(hidden).toHaveAttribute("aria-hidden", "true");
  expect(hidden).toHaveAttribute("tabindex", "-1");
});

test("renders no hidden input without a name", () => {
  render(<NoNameHarness />);

  expect(getHiddenInput()).toBeNull();
});

test("mirrors the committed value into the hidden input", async () => {
  const user = userEvent.setup();

  render(<FormHarness />);

  await user.type(getInput(), "ba");
  await user.keyboard("{ArrowDown}{Enter}");

  expect(getHiddenInput()).toHaveValue("b");
});

test("exposes the value through native FormData", async () => {
  const user = userEvent.setup();

  render(<FormHarness />);

  await user.type(getInput(), "ch");
  await user.keyboard("{ArrowDown}{Enter}");

  const data = new FormData(getForm());

  expect(data.get("fruit")).toBe("c");
});

test("form reset restores value, visible input and committed label", async () => {
  const user = userEvent.setup();

  render(<FormHarness defaultValue="a" defaultInputValue="Apple" />);

  const input = getInput();

  await user.clear(input);
  await user.type(input, "ba");
  await user.keyboard("{ArrowDown}{Enter}");

  expect(getHiddenInput()).toHaveValue("b");
  expect(input).toHaveValue("Banana");

  fireEvent.reset(getForm());

  expect(getHiddenInput()).toHaveValue("a");
  expect(input).toHaveValue("Apple");

  await user.clear(input);
  await user.type(input, "zzz");

  fireEvent.blur(input);

  expect(input).toHaveValue("Apple");
});

test("form reset clears both inputs without defaults", async () => {
  const user = userEvent.setup();

  render(<FormHarness />);

  const input = getInput();

  await user.type(input, "ch");
  await user.keyboard("{ArrowDown}{Enter}");

  expect(getHiddenInput()).toHaveValue("c");

  fireEvent.reset(getForm());

  expect(getHiddenInput()).toHaveValue("");
  expect(input).toHaveValue("");
});

test("form reset closes an open list", async () => {
  const user = userEvent.setup();

  render(<FormHarness />);

  await user.type(getInput(), "a");

  expect(queryList()).toBeInTheDocument();

  fireEvent.reset(getForm());

  expect(queryList()).toBeNull();
});

test("disabled combobox excludes its value from FormData", () => {
  render(<FormHarness defaultValue="a" defaultInputValue="Apple" disabled />);

  const data = new FormData(getForm());

  expect(data.get("fruit")).toBeNull();
});
