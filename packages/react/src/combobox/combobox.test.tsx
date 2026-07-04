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
    <Combobox.Root
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
  );
};

const getInput = () => screen.getByRole("combobox");
const queryList = () => screen.queryByRole("listbox");
const activeOption = () => {
  const id = getInput().getAttribute("aria-activedescendant");

  return id ? document.getElementById(id) : null;
};

test("stays closed until interaction", () => {
  render(<Harness />);

  expect(queryList()).toBeNull();
});

test("opens on typing and filters through external state", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  await user.type(getInput(), "ba");

  expect(screen.getByRole("listbox")).toBeInTheDocument();
  expect(screen.getAllByRole("option")).toHaveLength(1);
  expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
});

test("opens on click but not on focus alone", () => {
  render(<Harness />);

  const input = getInput();

  fireEvent.focus(input);

  expect(queryList()).toBeNull();

  fireEvent.click(input);

  expect(queryList()).toBeInTheDocument();
});

test("ArrowDown opens the list and highlights the first option", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  getInput().focus();

  await user.keyboard("{ArrowDown}");

  expect(queryList()).toBeInTheDocument();
  expect(activeOption()).toHaveTextContent("Apple");
});

test("arrow keys move the active option (aria-activedescendant)", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  getInput().focus();

  await user.keyboard("{ArrowDown}");

  expect(activeOption()).toHaveTextContent("Apple");

  await user.keyboard("{ArrowDown}");

  expect(activeOption()).toHaveTextContent("Banana");

  await user.keyboard("{ArrowUp}");

  expect(activeOption()).toHaveTextContent("Apple");
});

test("Enter commits the active option, closes and fills the input", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  render(<Harness onValueChange={onValueChange} />);

  getInput().focus();

  await user.keyboard("{ArrowDown}{ArrowDown}");
  await user.keyboard("{Enter}");

  expect(onValueChange).toHaveBeenCalledWith("b");
  expect(queryList()).toBeNull();
  expect(getInput()).toHaveValue("Banana");
});

test("Enter with a closed list does not prevent form submission", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn((e) => e.preventDefault());

  render(
    <form onSubmit={onSubmit}>
      <Harness />
      <button type="submit">Go</button>
    </form>,
  );

  const input = getInput();

  input.focus();

  expect(queryList()).toBeNull();

  await user.keyboard("{Enter}");

  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test("Space types a space instead of committing", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  render(<Harness onValueChange={onValueChange} />);

  await user.type(getInput(), "a b");

  expect(getInput()).toHaveValue("a b");
  expect(onValueChange).not.toHaveBeenCalled();
});

test("pointerdown on an option commits it and keeps focus in the input", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  const input = getInput();

  await user.click(input);

  const option = screen.getByRole("option", { name: "Cherry" });

  fireEvent.pointerDown(option);

  expect(input).toHaveFocus();
  expect(input).toHaveValue("Cherry");
  expect(queryList()).toBeNull();
});

test("blur outside reverts the draft and closes", async () => {
  const user = userEvent.setup();

  render(<Harness defaultValue="a" defaultInputValue="Apple" />);

  const input = getInput();

  await user.clear(input);
  await user.type(input, "zzz");

  fireEvent.blur(input);

  expect(input).toHaveValue("Apple");
  expect(queryList()).toBeNull();
});

test("Escape closes without committing", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  render(<Harness onValueChange={onValueChange} />);

  const input = getInput();

  await user.type(input, "ba");

  expect(queryList()).toBeInTheDocument();

  await user.keyboard("{Escape}");

  expect(queryList()).toBeNull();
  expect(onValueChange).not.toHaveBeenCalled();
});

test("Escape reverts the draft to the committed label", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  const input = getInput();

  await user.type(input, "ch");
  await user.keyboard("{ArrowDown}{Enter}");

  expect(input).toHaveValue("Cherry");

  await user.clear(input);
  await user.type(input, "zzz");
  await user.keyboard("{Escape}");

  expect(input).toHaveValue("Cherry");
  expect(queryList()).toBeNull();
});

test("filtering away the active option clears aria-activedescendant", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  const input = getInput();

  await user.type(input, "a");

  expect(activeOption()).toHaveTextContent("Apple");

  await user.type(input, "n");

  expect(input).toHaveValue("an");
  expect(getInput()).not.toHaveAttribute("aria-activedescendant");
});

test("reopening after a commit starts from the committed label", async () => {
  const user = userEvent.setup();

  render(<Harness />);

  const input = getInput();

  await user.type(input, "ch");
  await user.keyboard("{ArrowDown}{Enter}");

  expect(input).toHaveValue("Cherry");

  await user.click(input);

  expect(queryList()).toBeInTheDocument();
  expect(input).toHaveValue("Cherry");
  expect(screen.getByRole("option", { name: "Cherry" })).toBeInTheDocument();
});
