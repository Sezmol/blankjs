import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Tooltip } from "./index";
import "../styles.css";

test("a controlled tooltip stays open while the parent keeps it open", async () => {
  render(
    <Tooltip.Root open onOpenChange={() => {}}>
      <Tooltip.Trigger>Save</Tooltip.Trigger>
      <Tooltip.Content data-testid="content">Saves the draft</Tooltip.Content>
    </Tooltip.Root>,
  );

  const content = screen.getByTestId("content");

  await expect.poll(() => content.matches(":popover-open")).toBe(true);

  await userEvent.keyboard("{Escape}");

  await expect.poll(() => content.matches(":popover-open")).toBe(true);
});
