import { useState, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { CheckboxGroup } from "./index";
import { Field } from "../field";
import "../styles.css";

const fruits = ["apple", "banana", "cherry"];

const box = (name: string) =>
  screen.getByRole("checkbox", { name }) as HTMLInputElement;

const form = () => screen.getByRole("form") as HTMLFormElement;

const error = () => screen.queryByText("Pick one");

const send = () => userEvent.click(screen.getByRole("button", { name: "Send" }));

const requiredStates = () => fruits.map((fruit) => box(fruit).required);

const InForm = ({
  children,
  validationMode,
}: {
  children: ReactNode;
  validationMode?: "change";
}) => (
  <form aria-label="f" onSubmit={(e) => e.preventDefault()}>
    <Field.Root
      required
      validationMode={validationMode}
      errorMessages={{ valueMissing: "Pick one" }}
    >
      <Field.Label>Fruit</Field.Label>
      {children}
      <Field.Error />
    </Field.Root>
    <button type="submit">Send</button>
  </form>
);

const items = (disabledFirst = false) =>
  fruits.map((fruit, index) => (
    <CheckboxGroup.Item
      key={fruit}
      value={fruit}
      disabled={disabledFirst && index === 0}
    >
      {fruit}
    </CheckboxGroup.Item>
  ));

test("a failed submit focuses the first item and shows the error", async () => {
  render(
    <InForm>
      <CheckboxGroup.Root name="fruit">{items()}</CheckboxGroup.Root>
    </InForm>,
  );

  await send();

  await expect.poll(() => document.activeElement).toBe(box("apple"));
  expect(error()).not.toBeNull();
});

test("with the first item disabled a failed submit focuses the next one", async () => {
  render(
    <InForm>
      <CheckboxGroup.Root name="fruit">{items(true)}</CheckboxGroup.Root>
    </InForm>,
  );

  await send();

  await expect.poll(() => document.activeElement).toBe(box("banana"));
});

test("unchecking the last item shows the error right away", async () => {
  render(
    <InForm validationMode="change">
      <CheckboxGroup.Root name="fruit">{items()}</CheckboxGroup.Root>
    </InForm>,
  );

  await userEvent.click(box("apple"));

  expect(error()).toBeNull();

  await userEvent.click(box("apple"));

  await expect.poll(() => error()).not.toBeNull();
});

const Pinned = ({ value }: { value: string[] }) => (
  <InForm>
    <CheckboxGroup.Root name="fruit" value={value} onValueChange={() => {}}>
      {items()}
    </CheckboxGroup.Root>
  </InForm>
);

test.each(["mouse", "script"])(
  "a parent that refuses keeps checked, required, the error and FormData in line (%s)",
  async (how) => {
    const press = (name: string) =>
      how === "mouse" ? userEvent.click(box(name)) : box(name).click();

    const { rerender } = render(<Pinned value={[]} />);

    await send();
    await expect.poll(() => error()).not.toBeNull();

    await press("apple");

    expect(box("apple").checked).toBe(false);
    expect(requiredStates()).toEqual([true, true, true]);
    expect(error()).not.toBeNull();
    expect(new FormData(form()).getAll("fruit")).toEqual([]);

    rerender(<Pinned value={["apple"]} />);

    await expect.poll(() => error()).toBeNull();

    await press("apple");

    expect(box("apple").checked).toBe(true);
    expect(requiredStates()).toEqual([false, false, false]);
    expect(error()).toBeNull();
    expect(new FormData(form()).getAll("fruit")).toEqual(["apple"]);
  },
);

test("a required-only Field follows props and reset", async () => {
  const Harness = () => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <>
        <InForm>
          <CheckboxGroup.Root name="fruit" value={value} onValueChange={setValue}>
            {items()}
          </CheckboxGroup.Root>
        </InForm>
        <button type="button" onClick={() => setValue(["cherry"])}>
          Pick cherry
        </button>
      </>
    );
  };

  render(<Harness />);

  await send();
  await expect.poll(() => error()).not.toBeNull();

  await userEvent.click(screen.getByRole("button", { name: "Pick cherry" }));

  await expect.poll(() => error()).toBeNull();
  expect(form().checkValidity()).toBe(true);

  form().reset();

  await expect.poll(requiredStates).toEqual([true, true, true]);
  expect(box("cherry").checked).toBe(false);
  expect(form().checkValidity()).toBe(false);
  expect(new FormData(form()).getAll("fruit")).toEqual([]);
});

test("a checked item removed or disabled by a child updates the shown error", async () => {
  const Apple = () => {
    const [mode, setMode] = useState<"shown" | "disabled" | "gone">("shown");

    return (
      <>
        {mode !== "gone" && (
          <CheckboxGroup.Item value="apple" disabled={mode === "disabled"}>
            apple
          </CheckboxGroup.Item>
        )}
        <button type="button" onClick={() => setMode("disabled")}>
          Disable apple
        </button>
        <button type="button" onClick={() => setMode("shown")}>
          Show apple
        </button>
        <button type="button" onClick={() => setMode("gone")}>
          Remove apple
        </button>
      </>
    );
  };

  render(
    <InForm>
      <CheckboxGroup.Root name="fruit">
        <Apple />
        <CheckboxGroup.Item value="banana">banana</CheckboxGroup.Item>
      </CheckboxGroup.Root>
    </InForm>,
  );

  await send();
  await expect.poll(() => error()).not.toBeNull();

  await userEvent.click(box("apple"));
  await expect.poll(() => error()).toBeNull();

  await userEvent.click(screen.getByRole("button", { name: "Disable apple" }));
  await expect.poll(() => error()).not.toBeNull();

  await userEvent.click(screen.getByRole("button", { name: "Show apple" }));
  await expect.poll(() => error()).toBeNull();

  await userEvent.click(screen.getByRole("button", { name: "Remove apple" }));
  await expect.poll(() => error()).not.toBeNull();
  expect(box("banana").required).toBe(true);
});

test("a real form.reset() keeps FormData and validity in line", async () => {
  const Harness = () => {
    const [value, setValue] = useState<string[]>(["banana"]);

    return (
      <form aria-label="f">
        <CheckboxGroup.Root
          name="fruit"
          required
          value={value}
          defaultValue={["banana"]}
          onValueChange={setValue}
        >
          {items()}
        </CheckboxGroup.Root>
      </form>
    );
  };

  render(<Harness />);

  await userEvent.click(box("apple"));
  await userEvent.click(box("banana"));

  expect(new FormData(form()).getAll("fruit")).toEqual(["apple"]);

  form().reset();

  await expect
    .poll(() => new FormData(form()).getAll("fruit"))
    .toEqual(["banana"]);
  expect(form().checkValidity()).toBe(true);
});
