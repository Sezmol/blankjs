import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Form } from "./form";
import { Dialog } from "../dialog";
import { Checkbox } from "../checkbox/checkbox";
import { Field } from "../field";
import { TextInput } from "../text-input";

afterEach(cleanup);

test("submit includes the clicked button name and value", async () => {
  const submit = vi.fn();
  render(
    <Form onSubmit={submit}>
      <button name="intent" value="publish">Publish</button>
    </Form>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Publish" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(submit.mock.calls[0]![0].get("intent")).toBe("publish");
});

test("native dialog submission permits reopening and calls onClose", async () => {
  const onClose = vi.fn();
  render(
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content data-testid="dialog" onClose={onClose}>
        <Dialog.Title>Example</Dialog.Title>
        <form method="dialog"><button>Done</button></form>
      </Dialog.Content>
    </Dialog.Root>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  await userEvent.click(screen.getByRole("button", { name: "Done" }));
  const dialog = screen.getByTestId("dialog") as HTMLDialogElement;
  expect(dialog.open).toBe(false);
  await expect.poll(() => onClose.mock.calls.length).toBe(1);
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(dialog.open).toBe(true);
});

test("a canceled reset preserves checkbox state", async () => {
  render(
    <form onReset={e => e.preventDefault()}>
      <Checkbox aria-label="Agree" defaultChecked={false}/>
      <button type="reset">Reset</button>
    </form>,
  );
  await userEvent.click(screen.getByRole("checkbox"));
  expect(screen.getByRole("checkbox")).toBeChecked();
  await userEvent.click(screen.getByRole("button", { name: "Reset" }));
  expect(screen.getByRole("checkbox")).toBeChecked();
});

test.each(["ok", "wrong"])("reset revalidates the default value %s", async (defaultValue) => {
  render(
    <form>
      <Field.Root validate={v => v === "ok" ? null : "Must be ok"}>
        <Field.Label>Code</Field.Label>
        <TextInput defaultValue={defaultValue}/>
        <Field.Error/>
      </Field.Root>
      <button type="reset">Reset</button>
    </form>,
  );
  const input = screen.getByRole("textbox") as HTMLInputElement;
  await userEvent.fill(input, defaultValue === "ok" ? "wrong" : "ok");
  expect(input.validity.valid).toBe(defaultValue !== "ok");
  await userEvent.click(screen.getByRole("button", { name: "Reset" }));
  expect(input.value).toBe(defaultValue);
  expect(input.validity.valid).toBe(defaultValue === "ok");
});
