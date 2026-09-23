import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Tooltip } from "./index";
import { Dialog } from "../dialog";
import "../styles.css";

test("a tooltip the parent keeps open lets Escape close a dialog opened with the mouse", async () => {
  const onOpenChange = vi.fn();

  render(
    <div>
      <Tooltip.Root open onOpenChange={onOpenChange}>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content data-testid="tooltip">Saves the draft</Tooltip.Content>
      </Tooltip.Root>
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content data-testid="dialog">
          <Dialog.Title>Delete account</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>
    </div>,
  );

  const tooltip = screen.getByTestId("tooltip");
  const dialog = screen.getByTestId("dialog") as HTMLDialogElement;

  await expect.poll(() => tooltip.matches(":popover-open")).toBe(true);

  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  await expect.poll(() => dialog.open).toBe(true);
  expect(tooltip.matches(":popover-open")).toBe(false);
  expect(onOpenChange).toHaveBeenCalledWith(false);

  await userEvent.keyboard("{Escape}");

  await expect.poll(() => dialog.open).toBe(false);
});
