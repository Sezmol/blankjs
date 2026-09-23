import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Select } from "./index";
import "../styles.css";

const items = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);

const renderSelect = () =>
  render(
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Pick one" />
      </Select.Trigger>
      <Select.Content>
        {items.map((label) => (
          <Select.Item key={label} value={label}>
            {label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>,
  );

test("keeps the active option inside the scrolled listbox", async () => {
  renderSelect();

  screen.getByRole("combobox").focus();

  await userEvent.keyboard("{ArrowDown}");

  const listbox = screen.getByRole("listbox");

  for (let i = 0; i < 25; i++) await userEvent.keyboard("{ArrowDown}");

  const active = listbox.querySelector<HTMLElement>('[role="option"][data-active]');

  expect(active).not.toBeNull();
  expect(listbox.scrollTop).toBeGreaterThan(0);

  const view = listbox.getBoundingClientRect();
  const box = active!.getBoundingClientRect();

  expect(box.top).toBeGreaterThanOrEqual(view.top - 1);
  expect(box.bottom).toBeLessThanOrEqual(view.bottom + 1);
});

test("opening far down the page scrolls the listbox, not the page", async () => {
  render(
    <div style={{ paddingTop: "200vh" }}>
      <Select.Root defaultValue="Item 30">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {items.map((label) => (
            <Select.Item key={label} value={label}>
              {label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>,
  );

  const trigger = screen.getByRole("combobox");

  trigger.scrollIntoView({ block: "center" });

  const before = window.scrollY;

  await userEvent.click(trigger);

  const listbox = screen.getByRole("listbox");

  await expect.poll(() => listbox.scrollTop).toBeGreaterThan(0);

  expect(window.scrollY).toBe(before);
});

test("picking with the mouse keeps focus on the trigger", async () => {
  renderSelect();

  const trigger = screen.getByRole("combobox");

  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole("option", { name: "Item 1" }));

  expect(trigger).toHaveFocus();
});
