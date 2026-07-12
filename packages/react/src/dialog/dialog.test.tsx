import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./index";

const renderDialog = (
  props: Partial<React.ComponentProps<typeof Dialog.Root>> = {},
) =>
  render(
    <Dialog.Root {...props}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content data-testid="dialog">
        <Dialog.Title>Delete account</Dialog.Title>
        <Dialog.Description>This cannot be undone.</Dialog.Description>
        <button>Inside</button>
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>,
  );

const dialog = () => screen.getByTestId("dialog") as HTMLDialogElement;

test("trigger opens the dialog", async () => {
  const user = userEvent.setup();

  renderDialog();

  expect(dialog().open).toBe(false);
  expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
    "aria-haspopup",
    "dialog",
  );

  await user.click(screen.getByRole("button", { name: "Open" }));

  expect(dialog().open).toBe(true);
});

test("wires title and description through ARIA", async () => {
  const user = userEvent.setup();

  renderDialog();

  await user.click(screen.getByRole("button", { name: "Open" }));

  const title = screen.getByText("Delete account");
  const description = screen.getByText("This cannot be undone.");

  expect(dialog()).toHaveAttribute("aria-labelledby", title.id);
  expect(dialog()).toHaveAttribute("aria-describedby", description.id);
});

test("close button closes the dialog", async () => {
  const user = userEvent.setup();

  renderDialog({ defaultOpen: true });

  expect(dialog().open).toBe(true);

  await user.click(screen.getByRole("button", { name: "Cancel" }));

  expect(dialog().open).toBe(false);
});

test("cancel (Escape) closes through state", () => {
  renderDialog({ defaultOpen: true });

  fireEvent(dialog(), new Event("cancel", { cancelable: true }));

  expect(dialog().open).toBe(false);
});

test("vetoed cancel keeps the dialog open", () => {
  render(
    <Dialog.Root defaultOpen>
      <Dialog.Content
        data-testid="dialog"
        onCancel={(e) => e.preventDefault()}
      >
        <Dialog.Title>Stay</Dialog.Title>
      </Dialog.Content>
    </Dialog.Root>,
  );

  fireEvent(dialog(), new Event("cancel", { cancelable: true }));

  expect(dialog().open).toBe(true);
});

test("backdrop click closes, inner click does not", async () => {
  const user = userEvent.setup();

  renderDialog({ defaultOpen: true });

  await user.click(screen.getByRole("button", { name: "Inside" }));

  expect(dialog().open).toBe(true);

  fireEvent.click(dialog());

  expect(dialog().open).toBe(false);
});

test("works controlled", async () => {
  const user = userEvent.setup();
  const onOpenChange = vi.fn();

  const Controlled = () => {
    const [open, setOpen] = useState(false);

    return (
      <Dialog.Root
        open={open}
        onOpenChange={(o) => {
          onOpenChange(o);
          setOpen(o);
        }}
      >
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content data-testid="dialog">
          <Dialog.Title>Controlled</Dialog.Title>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    );
  };

  render(<Controlled />);

  await user.click(screen.getByRole("button", { name: "Open" }));

  expect(onOpenChange).toHaveBeenCalledWith(true);
  expect(dialog().open).toBe(true);

  await user.click(screen.getByRole("button", { name: "Cancel" }));

  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(dialog().open).toBe(false);
});

test("omits aria attributes without title and description", () => {
  render(
    <Dialog.Root defaultOpen>
      <Dialog.Content data-testid="dialog" aria-label="Bare">
        Bare content
      </Dialog.Content>
    </Dialog.Root>,
  );

  expect(dialog()).not.toHaveAttribute("aria-labelledby");
  expect(dialog()).not.toHaveAttribute("aria-describedby");
});
