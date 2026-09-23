import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Form } from "./form";
import { Dialog } from "../dialog";
import { Checkbox } from "../checkbox/checkbox";
import { Field } from "../field";
import { TextInput } from "../text-input";
import { Switch } from "../switch";
import { RadioGroup } from "../radio";
import { Select } from "../select";
import { MultiSelect } from "../multi-select";
import { Combobox } from "../combobox";
import { PinInput } from "../pin-input";
import { FieldArray } from "../field-array";

afterEach(cleanup);

const nextTask = () => new Promise((resolve) => setTimeout(resolve));

const pickOption = async (name: string) => {
  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.click(screen.getByRole("option", { name }));
};

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

type ResetCase = [string, ReactNode, () => Promise<void>, string[]];

const canceledResetCases: ResetCase[] = [
  [
    "Checkbox",
    <Checkbox name="x" aria-label="X" />,
    () => userEvent.click(screen.getByRole("checkbox")),
    ["on"],
  ],
  [
    "Switch",
    <Switch name="x" aria-label="X" />,
    () => userEvent.click(screen.getByRole("switch")),
    ["on"],
  ],
  [
    "RadioGroup",
    <RadioGroup.Root name="x" defaultValue="a" aria-label="X">
      <RadioGroup.Item value="a" aria-label="A" />
      <RadioGroup.Item value="b" aria-label="B" />
    </RadioGroup.Root>,
    () => userEvent.click(screen.getByRole("radio", { name: "B" })),
    ["b"],
  ],
  [
    "Select",
    <Select.Root name="x" defaultValue="a">
      <Select.Trigger aria-label="X">Choose</Select.Trigger>
      <Select.Content>
        <Select.Item value="a">A</Select.Item>
        <Select.Item value="b">B</Select.Item>
      </Select.Content>
    </Select.Root>,
    () => pickOption("B"),
    ["b"],
  ],
  [
    "MultiSelect",
    <MultiSelect.Root name="x">
      <MultiSelect.Trigger aria-label="X">Choose</MultiSelect.Trigger>
      <MultiSelect.Content>
        <MultiSelect.Item value="a">A</MultiSelect.Item>
        <MultiSelect.Item value="b">B</MultiSelect.Item>
      </MultiSelect.Content>
    </MultiSelect.Root>,
    async () => {
      await pickOption("B");
      await userEvent.keyboard("{Escape}");
    },
    ["b"],
  ],
  [
    "Combobox",
    <Combobox.Root name="x">
      <Combobox.Input aria-label="X" />
      <Combobox.Content>
        <Combobox.Item value="a">A</Combobox.Item>
        <Combobox.Item value="b">B</Combobox.Item>
      </Combobox.Content>
    </Combobox.Root>,
    () => pickOption("B"),
    ["b"],
  ],
  [
    "PinInput",
    <PinInput name="x" length={3} />,
    async () => {
      await userEvent.click(screen.getAllByRole("textbox")[0]!);
      await userEvent.keyboard("123");
    },
    ["123"],
  ],
];

test.each(canceledResetCases)(
  "a canceled reset keeps the %s value",
  async (_, control, change, expected) => {
    render(
      <form data-testid="form" onReset={(e) => e.preventDefault()}>
        {control}
        <button type="reset">Reset</button>
      </form>,
    );

    const values = () =>
      new FormData(screen.getByTestId("form") as HTMLFormElement).getAll("x");

    await change();

    expect(values()).toEqual(expected);

    await userEvent.click(screen.getByRole("button", { name: "Reset" }));
    await nextTask();

    expect(values()).toEqual(expected);
  },
);

test("a canceled reset keeps the FieldArray rows", async () => {
  render(
    <form onReset={(e) => e.preventDefault()}>
      <FieldArray name="users" defaultItems={[{ email: "" }]}>
        {({ rows }) => (
          <>
            {rows.map((row) => (
              <TextInput
                key={row.key}
                aria-label="Email"
                name={row.name("email")}
              />
            ))}
            <FieldArray.Add>Add</FieldArray.Add>
          </>
        )}
      </FieldArray>
      <button type="reset">Reset</button>
    </form>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Add" }));
  await userEvent.click(screen.getByRole("button", { name: "Reset" }));
  await nextTask();

  expect(screen.getAllByRole("textbox")).toHaveLength(2);
});

test("a canceled reset keeps the schema error", async () => {
  const schema: StandardSchemaV1 = {
    "~standard": {
      version: 1,
      vendor: "blankjs-test",
      validate: () => ({ issues: [{ message: "Nothing adds up" }] }),
    },
  };

  render(
    <Form
      schema={schema}
      onSubmit={vi.fn()}
      onReset={(e) => e.preventDefault()}
    >
      <Form.Error />
      <button>Go</button>
      <button type="reset">Reset</button>
    </Form>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByRole("alert")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Reset" }));
  await nextTask();

  expect(screen.getByRole("alert")).toBeInTheDocument();
});

test("a form rendered through a portal submits on its own", async () => {
  const onSubmit = vi.fn();
  let innerSubmit: Event | undefined;

  const record = (e: Event) => {
    innerSubmit = e;
  };

  window.addEventListener("submit", record);

  render(
    <Form onSubmit={onSubmit}>
      {createPortal(
        <form method="dialog">
          <button>Inner</button>
        </form>,
        document.body,
      )}
    </Form>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Inner" }));

  window.removeEventListener("submit", record);

  expect(onSubmit).not.toHaveBeenCalled();
  expect(innerSubmit?.defaultPrevented).toBe(false);
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

test("a failed submit in a plain form focuses the first invalid Field", async () => {
  render(
    <form onSubmit={(e) => e.preventDefault()}>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <TextInput name="name" />
      </Field.Root>
      <Field.Root required>
        <Field.Label>Email</Field.Label>
        <TextInput name="email" />
      </Field.Root>
      <button>Send</button>
    </form>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(screen.getByLabelText("Email")).toHaveFocus();
});

test("Enter in a field counts as a submit attempt", async () => {
  render(
    <form onSubmit={(e) => e.preventDefault()}>
      <Field.Root required>
        <Field.Label>Agree</Field.Label>
        <Checkbox name="agree" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <TextInput name="name" />
      </Field.Root>
    </form>,
  );

  await userEvent.click(screen.getByLabelText("Name"));
  await userEvent.keyboard("{Enter}");

  expect(screen.getByLabelText("Agree")).toHaveFocus();
});

test("checkValidity from code does not move focus", async () => {
  render(
    <Form data-testid="form" onSubmit={vi.fn()}>
      <Field.Root required>
        <Field.Label>Email</Field.Label>
        <TextInput name="email" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <TextInput name="name" />
      </Field.Root>
    </Form>,
  );

  await userEvent.click(screen.getByLabelText("Name"));

  (screen.getByTestId("form") as HTMLFormElement).checkValidity();

  expect(screen.getByLabelText("Name")).toHaveFocus();
});
