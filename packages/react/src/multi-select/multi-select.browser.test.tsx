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
