import { render, screen } from "@testing-library/react";
import { page, userEvent } from "vitest/browser";
import { Popover } from "./index";
import { Select } from "../select";
import { Combobox } from "../combobox";
import { MultiSelect } from "../multi-select";
import { Dialog } from "../dialog";
import "../styles.css";

const settle = () =>
  Promise.all(document.getAnimations().map((a) => a.finished));

const popoverOpen = () =>
  screen.getByTestId("popover").matches(":popover-open");

const SelectInPopover = () => (
  <Popover.Root>
    <Popover.Trigger>Settings</Popover.Trigger>
    <Popover.Content data-testid="popover">
      <Select.Root>
        <Select.Trigger aria-label="Fruit">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Content>
      </Select.Root>
    </Popover.Content>
  </Popover.Root>
);

test("picking from a Select inside a Popover keeps the Popover open", async () => {
  render(<SelectInPopover />);

  await userEvent.click(screen.getByRole("button", { name: "Settings" }));
  await settle();
  await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }));
  await userEvent.click(screen.getByRole("option", { name: "Banana" }));

  expect(popoverOpen()).toBe(true);
  expect(screen.getByRole("combobox", { name: "Fruit" }).textContent).toBe(
    "banana",
  );
});

test("picking from a Combobox inside a Popover keeps the Popover open", async () => {
  render(
    <Popover.Root>
      <Popover.Trigger>Settings</Popover.Trigger>
      <Popover.Content data-testid="popover">
        <Combobox.Root>
          <Combobox.Input aria-label="City" />
          <Combobox.Content>
            <Combobox.Item value="Oslo">Oslo</Combobox.Item>
            <Combobox.Item value="Rome">Rome</Combobox.Item>
          </Combobox.Content>
        </Combobox.Root>
      </Popover.Content>
    </Popover.Root>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Settings" }));
  await settle();
  await userEvent.click(screen.getByRole("combobox", { name: "City" }));
  await userEvent.keyboard("{ArrowDown}");
  await userEvent.click(screen.getByRole("option", { name: "Rome" }));

  expect(popoverOpen()).toBe(true);
  expect(screen.getByRole("combobox", { name: "City" })).toHaveProperty(
    "value",
    "Rome",
  );
});

test("picking from a MultiSelect inside a Popover keeps both open", async () => {
  render(
    <Popover.Root>
      <Popover.Trigger>Settings</Popover.Trigger>
      <Popover.Content data-testid="popover">
        <MultiSelect.Root>
          <MultiSelect.Trigger aria-label="Tags">
            <MultiSelect.Value placeholder="Pick" />
          </MultiSelect.Trigger>
          <MultiSelect.Content>
            <MultiSelect.Item value="red">Red</MultiSelect.Item>
            <MultiSelect.Item value="blue">Blue</MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect.Root>
      </Popover.Content>
    </Popover.Root>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Settings" }));
  await settle();
  await userEvent.click(screen.getByRole("combobox", { name: "Tags" }));
  await userEvent.click(screen.getByRole("option", { name: "Blue" }));

  expect(popoverOpen()).toBe(true);
  expect(screen.getByRole("listbox")).toBeTruthy();
});

test("Escape closes the Select first and the Popover second", async () => {
  render(<SelectInPopover />);

  await userEvent.click(screen.getByRole("button", { name: "Settings" }));
  await settle();
  await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }));
  await userEvent.keyboard("{Escape}");

  expect(screen.queryByRole("listbox")).toBeNull();
  expect(popoverOpen()).toBe(true);

  await userEvent.keyboard("{Escape}");

  expect(popoverOpen()).toBe(false);
});

test("a press outside closes the Select and the Popover", async () => {
  render(<SelectInPopover />);

  await userEvent.click(screen.getByRole("button", { name: "Settings" }));
  await settle();
  await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }));
  await userEvent.click(page.elementLocator(document.body), {
    position: { x: window.innerWidth - 4, y: window.innerHeight - 4 },
  });

  expect(screen.queryByRole("listbox")).toBeNull();
  expect(popoverOpen()).toBe(false);
});

test("a Select in a Popover in a Dialog renders into the Popover", async () => {
  render(
    <Dialog.Root>
      <Dialog.Trigger>Edit</Dialog.Trigger>
      <Dialog.Content data-testid="dialog">
        <Dialog.Title>Edit</Dialog.Title>
        <SelectInPopover />
      </Dialog.Content>
    </Dialog.Root>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Edit" }));
  await settle();
  await userEvent.click(screen.getByRole("button", { name: "Settings" }));
  await settle();
  await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }));

  const listbox = screen.getByRole("listbox");

  expect(screen.getByTestId("popover").contains(listbox)).toBe(true);

  await userEvent.click(screen.getByRole("option", { name: "Apple" }));

  expect(popoverOpen()).toBe(true);
  expect(screen.getByTestId("dialog").matches("[open]")).toBe(true);
});

test("a Select opened while the Popover still animates lands under its trigger", async () => {
  render(<SelectInPopover />);

  await userEvent.click(screen.getByRole("button", { name: "Settings" }));
  screen.getByRole("combobox", { name: "Fruit" }).click();
  await settle();
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const trigger = screen.getByRole("combobox", { name: "Fruit" });
  const listbox = screen.getByRole("listbox");

  expect(
    Math.abs(
      listbox.getBoundingClientRect().top -
        trigger.getBoundingClientRect().bottom,
    ),
  ).toBeLessThan(8);
  expect(
    Math.abs(
      listbox.getBoundingClientRect().left -
        trigger.getBoundingClientRect().left,
    ),
  ).toBeLessThan(2);
});

test("a Select opened while a Dialog still animates lands under its trigger", async () => {
  render(
    <Dialog.Root>
      <Dialog.Trigger>Edit</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit</Dialog.Title>
        <Select.Root>
          <Select.Trigger aria-label="Fruit">
            <Select.Value placeholder="Pick" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
          </Select.Content>
        </Select.Root>
      </Dialog.Content>
    </Dialog.Root>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Edit" }));
  screen.getByRole("combobox", { name: "Fruit" }).click();
  await settle();
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const trigger = screen.getByRole("combobox", { name: "Fruit" });
  const listbox = screen.getByRole("listbox");

  expect(
    Math.abs(
      listbox.getBoundingClientRect().top -
        trigger.getBoundingClientRect().bottom,
    ),
  ).toBeLessThan(8);
});
