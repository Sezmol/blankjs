import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Combobox } from "./index";
import "../styles.css";

test("clicking an option commits it and keeps focus in the input", async () => {
  render(
    <Combobox.Root>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        <Combobox.Item value="a">Apple</Combobox.Item>
      </Combobox.Content>
    </Combobox.Root>,
  );

  const input = screen.getByRole("combobox");

  await userEvent.click(input);
  await userEvent.click(screen.getByRole("option", { name: "Apple" }));

  expect(input).toHaveValue("Apple");
  expect(input).toHaveFocus();
});

test("opening far down the page scrolls the listbox, not the page", async () => {
  const items = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);

  render(
    <div style={{ paddingTop: "200vh" }}>
      <Combobox.Root defaultValue="Item 30">
        <Combobox.Input aria-label="Item" />
        <Combobox.Content>
          {items.map((label) => (
            <Combobox.Item key={label} value={label}>
              {label}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Root>
    </div>,
  );

  const input = screen.getByRole("combobox");

  input.scrollIntoView({ block: "center" });

  const before = window.scrollY;

  await userEvent.click(input);

  const listbox = await screen.findByRole("listbox");

  await expect.poll(() => listbox.scrollTop).toBeGreaterThan(0);
  await Promise.all(listbox.getAnimations({ subtree: true }).map((a) => a.finished));

  const view = listbox.getBoundingClientRect();
  const box = screen.getByRole("option", { name: "Item 30" }).getBoundingClientRect();

  expect(window.scrollY).toBe(before);
  expect(box.top).toBeGreaterThanOrEqual(view.top - 1);
  expect(box.bottom).toBeLessThanOrEqual(view.bottom + 1);
});
