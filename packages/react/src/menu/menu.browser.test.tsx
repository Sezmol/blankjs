import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Menu } from "./index";
import "../styles.css";

test("a controlled menu stays closed while the parent keeps it closed", async () => {
  render(
    <Menu.Root open={false} onOpenChange={() => {}}>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content data-testid="content">
        <Menu.Item>Edit</Menu.Item>
      </Menu.Content>
    </Menu.Root>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Actions" }));

  await expect
    .poll(() => screen.getByTestId("content").matches(":popover-open"))
    .toBe(false);
});
