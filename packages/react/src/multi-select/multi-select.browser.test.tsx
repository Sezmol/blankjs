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

test("opening far down the page does not scroll the page", async () => {
  render(
    <div style={{ paddingTop: "200vh" }}>
      <MultiSelect.Root>
        <MultiSelect.Trigger>Days</MultiSelect.Trigger>
        <MultiSelect.Content>
          <MultiSelect.Item value="mon">Mon</MultiSelect.Item>
          <MultiSelect.Item value="tue">Tue</MultiSelect.Item>
        </MultiSelect.Content>
      </MultiSelect.Root>
    </div>,
  );

  const trigger = screen.getByRole("combobox");

  trigger.scrollIntoView({ block: "center" });

  const before = window.scrollY;

  await userEvent.click(trigger);

  const listbox = await screen.findByRole("listbox");

  await expect.poll(() => listbox.querySelector("[data-active]")).not.toBeNull();

  expect(window.scrollY).toBe(before);
});
