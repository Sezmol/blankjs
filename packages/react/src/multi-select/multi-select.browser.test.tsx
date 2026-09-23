import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { MultiSelect } from "./index";
import "../styles.css";

test("picking with the mouse keeps focus on the trigger", async () => {
  render(
    <MultiSelect.Root>
      <MultiSelect.Trigger>Days</MultiSelect.Trigger>
      <MultiSelect.Content>
        <MultiSelect.Item value="mon">Mon</MultiSelect.Item>
      </MultiSelect.Content>
    </MultiSelect.Root>,
  );

  const trigger = screen.getByRole("combobox");

  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole("option", { name: "Mon" }));

  expect(trigger).toHaveFocus();
});

test("opening far down the page scrolls the listbox, not the page", async () => {
  const items = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);

  render(
    <div style={{ paddingTop: "200vh" }}>
      <MultiSelect.Root defaultValue={["Item 30"]}>
        <MultiSelect.Trigger>Items</MultiSelect.Trigger>
        <MultiSelect.Content>
          {items.map((label) => (
            <MultiSelect.Item key={label} value={label}>
              {label}
            </MultiSelect.Item>
          ))}
        </MultiSelect.Content>
      </MultiSelect.Root>
    </div>,
  );

  const trigger = screen.getByRole("combobox");

  trigger.scrollIntoView({ block: "center" });

  const before = window.scrollY;

  await userEvent.click(trigger);

  const listbox = await screen.findByRole("listbox");

  await expect.poll(() => listbox.scrollTop).toBeGreaterThan(0);
  await Promise.all(listbox.getAnimations({ subtree: true }).map((a) => a.finished));

  const view = listbox.getBoundingClientRect();
  const box = screen.getByRole("option", { name: "Item 30" }).getBoundingClientRect();

  expect(window.scrollY).toBe(before);
  expect(box.top).toBeGreaterThanOrEqual(view.top - 1);
  expect(box.bottom).toBeLessThanOrEqual(view.bottom + 1);
});
