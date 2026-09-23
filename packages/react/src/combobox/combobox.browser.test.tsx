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

test("opening far down the page does not scroll the page", async () => {
  render(
    <div style={{ paddingTop: "200vh" }}>
      <Combobox.Root>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          <Combobox.Item value="a">Apple</Combobox.Item>
          <Combobox.Item value="b">Banana</Combobox.Item>
        </Combobox.Content>
      </Combobox.Root>
    </div>,
  );

  const input = screen.getByRole("combobox");

  input.scrollIntoView({ block: "center" });

  const before = window.scrollY;

  await userEvent.click(input);

  const listbox = await screen.findByRole("listbox");

  await expect.poll(() => listbox.querySelector("[data-active]")).not.toBeNull();

  expect(window.scrollY).toBe(before);
});
