import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("opens the listbox with ArrowDown", async () => {
  const user = userEvent.setup();

  renderSelect();

  const trigger = screen.getByRole("combobox");

  trigger.focus();

  await user.keyboard("{ArrowDown}");

  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

test("moves the active option with arrows", async () => {
  const user = userEvent.setup();

  renderSelect();

  const trigger = screen.getByRole("combobox");

  trigger.focus();

  await user.keyboard("{ArrowDown}");
  await user.keyboard("{ArrowDown}");

  const banana = screen.getByRole("option", { name: "Banana" });

  expect(banana).toHaveAttribute("data-active");
});

test("jumps to the last option with End and first with Home", async () => {
  const user = userEvent.setup();

  renderSelect();

  const trigger = screen.getByRole("combobox");

  trigger.focus();

  await user.keyboard("{ArrowDown}");

  await user.keyboard("{End}");

  const cherry = screen.getByRole("option", { name: "Cherry" });

  expect(cherry).toHaveAttribute("data-active");

  await user.keyboard("{Home}");

  const apple = screen.getByRole("option", { name: "Apple" });

  expect(apple).toHaveAttribute("data-active");
});

test("selects the active option with Enter and closes", async () => {
  const user = userEvent.setup();

  renderSelect();

  const trigger = screen.getByRole("combobox");

  trigger.focus();

  await user.keyboard("{ArrowDown}");

  await user.keyboard("{ArrowDown}");

  await user.keyboard("{Enter}");

  expect(trigger).toHaveTextContent("b");
});

test("points aria-activedescendant at the active option", async () => {
  const user = userEvent.setup();

  renderSelect();

  const trigger = screen.getByRole("combobox");

  trigger.focus();

  await user.keyboard("{ArrowDown}");

  const active = screen.getByRole("option", { name: "Apple" });

  expect(trigger).toHaveAttribute("aria-activedescendant", active.id);
});

test("jumps to a matching option by typeahead", async () => {
  const user = userEvent.setup();

  renderSelect();

  const trigger = screen.getByRole("combobox");

  trigger.focus();

  await user.keyboard("{ArrowDown}");

  await user.keyboard("c");

  const cherry = screen.getByRole("option", { name: "Cherry" });

  expect(cherry).toHaveAttribute("data-active");
});

test("closes on Tab", async () => {
  const user = userEvent.setup();

  renderSelect();

  const trigger = screen.getByRole("combobox");

  trigger.focus();

  await user.keyboard("{ArrowDown}");

  await user.keyboard("{Tab}");

  expect(screen.queryByRole("listbox")).toBeNull();
});
