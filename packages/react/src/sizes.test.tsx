import { render, screen } from "@testing-library/react";
import { TextInput } from "./text-input";
import { Textarea } from "./textarea";
import { Checkbox } from "./checkbox";
import { Switch } from "./switch";
import { PasswordField } from "./password-field";
import { RadioGroup } from "./radio";
import { Select } from "./select";
import { MultiSelect } from "./multi-select";
import { Combobox } from "./combobox";

test("controls default to md", () => {
  render(<TextInput aria-label="input" />);

  expect(screen.getByLabelText("input")).toHaveAttribute("data-size", "md");
});

test("simple controls render their size", () => {
  render(
    <>
      <TextInput aria-label="input" size="sm" />
      <Textarea aria-label="textarea" size="lg" />
      <Checkbox aria-label="checkbox" size="sm" />
      <Switch aria-label="switch" size="lg" />
    </>,
  );

  expect(screen.getByLabelText("input")).toHaveAttribute("data-size", "sm");
  expect(screen.getByLabelText("textarea")).toHaveAttribute("data-size", "lg");
  expect(screen.getByLabelText("checkbox")).toHaveAttribute("data-size", "sm");
  expect(screen.getByLabelText("switch").parentElement).toHaveAttribute(
    "data-size",
    "lg",
  );
});

test("password field stamps size on its wrapper", () => {
  render(<PasswordField aria-label="password" size="sm" />);

  expect(
    screen.getByLabelText("password").closest(".bk-password"),
  ).toHaveAttribute("data-size", "sm");
});

test("radio group stamps size on the group", () => {
  render(
    <RadioGroup.Root size="sm" aria-label="group">
      <RadioGroup.Item value="a">A</RadioGroup.Item>
    </RadioGroup.Root>,
  );

  expect(screen.getByRole("radiogroup")).toHaveAttribute("data-size", "sm");
});

test("select stamps size on root wrapper and portaled content", () => {
  const { container } = render(
    <Select.Root size="sm" defaultOpen>
      <Select.Trigger>Pick</Select.Trigger>
      <Select.Content>
        <Select.Item value="a">A</Select.Item>
      </Select.Content>
    </Select.Root>,
  );

  expect(container.querySelector(".bk-select-root")).toHaveAttribute(
    "data-size",
    "sm",
  );
  expect(screen.getByRole("listbox")).toHaveAttribute("data-size", "sm");
});

test("multi select stamps size on root wrapper and portaled content", () => {
  const { container } = render(
    <MultiSelect.Root size="lg" defaultOpen>
      <MultiSelect.Trigger>Pick</MultiSelect.Trigger>
      <MultiSelect.Content>
        <MultiSelect.Item value="a">A</MultiSelect.Item>
      </MultiSelect.Content>
    </MultiSelect.Root>,
  );

  expect(container.querySelector(".bk-multi-select-root")).toHaveAttribute(
    "data-size",
    "lg",
  );
  expect(screen.getByRole("listbox")).toHaveAttribute("data-size", "lg");
});

test("combobox stamps size on root wrapper and portaled content", () => {
  const { container } = render(
    <Combobox.Root size="sm" defaultOpen>
      <Combobox.Input aria-label="search" />
      <Combobox.Content>
        <Combobox.Item value="a">A</Combobox.Item>
      </Combobox.Content>
    </Combobox.Root>,
  );

  expect(container.querySelector(".bk-combobox-root")).toHaveAttribute(
    "data-size",
    "sm",
  );
  expect(screen.getByRole("listbox")).toHaveAttribute("data-size", "sm");
});
