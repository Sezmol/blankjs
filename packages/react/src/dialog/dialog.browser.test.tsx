import { render, screen } from "@testing-library/react";
import { cdp, userEvent } from "vitest/browser";
import { Dialog } from "./index";
import "../styles.css";

const clickAt = async (x: number, y: number) => {
  const session = cdp();
  const base = { x, y, button: "left" as const, clickCount: 1 };

  await session.send("Input.dispatchMouseEvent", { type: "mousePressed", ...base });
  await session.send("Input.dispatchMouseEvent", { type: "mouseReleased", ...base });
};

const renderDialog = () =>
  render(
    <div>
      <button>Outside</button>
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content data-testid="dialog">
          <Dialog.Title>Delete account</Dialog.Title>
          <button>Inside</button>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>,
  );

const dialog = () => screen.getByTestId("dialog") as HTMLDialogElement;

test("showModal makes the page behind it inert", async () => {
  renderDialog();

  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  expect(dialog().open).toBe(true);
  expect(dialog().matches(":modal")).toBe(true);

  const outside = screen.getByRole("button", { name: "Outside" });

  outside.focus();

  expect(document.activeElement).not.toBe(outside);
  expect(dialog().contains(document.activeElement)).toBe(true);
});

test("the browser traps tab inside the dialog", async () => {
  renderDialog();

  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  const inside = screen.getByRole("button", { name: "Inside" });
  const close = screen.getByRole("button", { name: "Cancel" });

  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();

  expect([inside, close]).toContain(document.activeElement);
});

test("Escape closes and focus goes back to the trigger", async () => {
  renderDialog();

  const trigger = screen.getByRole("button", { name: "Open" });

  await userEvent.click(trigger);
  await userEvent.keyboard("{Escape}");

  expect(dialog().open).toBe(false);
  expect(document.activeElement).toBe(trigger);
});

test("a click on the backdrop closes", async () => {
  renderDialog();

  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  const box = dialog().getBoundingClientRect();

  expect(box.top).toBeGreaterThan(8);

  await clickAt(4, 4);

  expect(dialog().open).toBe(false);
});
