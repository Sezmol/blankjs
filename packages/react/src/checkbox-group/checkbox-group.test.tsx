import { useState } from "react";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxGroup } from "./index";
import { Field } from "../field";
import { Checkbox } from "../checkbox";

const fruits = ["apple", "banana", "cherry"];

const renderGroup = (
  rootProps: React.ComponentProps<typeof CheckboxGroup.Root> = {},
) =>
  render(
    <form aria-label="f">
      <CheckboxGroup.Root aria-label="Fruit" {...rootProps}>
        {fruits.map((fruit) => (
          <CheckboxGroup.Item key={fruit} value={fruit} aria-label={fruit} />
        ))}
      </CheckboxGroup.Root>
    </form>,
  );

const box = (name: string) =>
  screen.getByRole("checkbox", { name }) as HTMLInputElement;

const form = () => screen.getByRole("form") as HTMLFormElement;

test("renders a group of native checkboxes", () => {
  renderGroup();

  expect(screen.getByRole("group", { name: "Fruit" })).toBeInTheDocument();
  expect(screen.getAllByRole("checkbox")).toHaveLength(3);
});

test("toggles values in click order", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  renderGroup({ onValueChange });

  await user.click(box("cherry"));
  await user.click(box("apple"));

  expect(onValueChange).toHaveBeenLastCalledWith(["cherry", "apple"]);
  expect(box("cherry")).toBeChecked();
  expect(box("apple")).toBeChecked();

  await user.click(box("cherry"));

  expect(onValueChange).toHaveBeenLastCalledWith(["apple"]);
  expect(box("cherry")).not.toBeChecked();
});

test("respects defaultValue", () => {
  renderGroup({ defaultValue: ["banana"] });

  expect(box("apple")).not.toBeChecked();
  expect(box("banana")).toBeChecked();
  expect(box("cherry")).not.toBeChecked();
});

test("controlled: does not change without parent update", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  renderGroup({ value: [], onValueChange });

  await user.click(box("apple"));

  expect(onValueChange).toHaveBeenCalledWith(["apple"]);
  expect(box("apple")).not.toBeChecked();
});

test("onChange veto (preventDefault) blocks the toggle", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  const vetoed = (sync?: boolean) => (
    <CheckboxGroup.Root onValueChange={onValueChange} data-sync={sync}>
      <CheckboxGroup.Item
        value="apple"
        aria-label="apple"
        onChange={(e) => e.preventDefault()}
      />
    </CheckboxGroup.Root>
  );

  const { rerender } = render(vetoed());

  await user.click(box("apple"));

  rerender(vetoed(true));

  expect(onValueChange).not.toHaveBeenCalled();
  expect(box("apple")).not.toBeChecked();
});

test("submits checked values through FormData in markup order", async () => {
  const user = userEvent.setup();

  renderGroup({ name: "fruit" });

  await user.click(box("cherry"));
  await user.click(box("apple"));

  expect(new FormData(form()).getAll("fruit")).toEqual(["apple", "cherry"]);
});

test("leaves disabled and unmounted values out of FormData", () => {
  render(
    <form aria-label="f">
      <CheckboxGroup.Root name="fruit" value={["apple", "gone"]}>
        <CheckboxGroup.Item value="apple" aria-label="apple" disabled />
        <CheckboxGroup.Item value="banana" aria-label="banana" />
      </CheckboxGroup.Root>
    </form>,
  );

  expect(box("apple")).toBeChecked();
  expect(new FormData(form()).getAll("fruit")).toEqual([]);
});

test("without name nothing is submitted", async () => {
  const user = userEvent.setup();

  renderGroup();

  await user.click(box("apple"));

  expect([...new FormData(form()).keys()]).toEqual([]);
});

test("group disabled disables all items", () => {
  renderGroup({ disabled: true });

  for (const fruit of fruits) expect(box(fruit)).toBeDisabled();
});

test("item disabled={false} overrides the group", () => {
  render(
    <CheckboxGroup.Root disabled>
      <CheckboxGroup.Item value="apple" aria-label="apple" disabled={false} />
      <CheckboxGroup.Item value="banana" aria-label="banana" />
    </CheckboxGroup.Root>,
  );

  expect(box("apple")).toBeEnabled();
  expect(box("banana")).toBeDisabled();
});

test("wraps itself in a label when given children", async () => {
  const user = userEvent.setup();

  render(
    <CheckboxGroup.Root>
      <CheckboxGroup.Item value="apple">Apple</CheckboxGroup.Item>
    </CheckboxGroup.Root>,
  );

  await user.click(screen.getByText("Apple"));

  expect(box("Apple")).toBeChecked();
});

test("routes className to the label wrapper when children are given", () => {
  render(
    <CheckboxGroup.Root>
      <CheckboxGroup.Item value="apple" className="mine">
        Apple
      </CheckboxGroup.Item>
    </CheckboxGroup.Root>,
  );

  expect(screen.getByText("Apple").closest("label")).toHaveClass("mine");
  expect(box("Apple")).not.toHaveClass("mine");
});

test("parts outside Root throw", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => render(<CheckboxGroup.Item value="apple" />)).toThrow(
    /within CheckboxGroup.Root/,
  );

  spy.mockRestore();
});

test("fireEvent clicks toggle too", () => {
  renderGroup({ name: "fruit" });

  fireEvent.click(box("banana"));

  expect(new FormData(form()).getAll("fruit")).toEqual(["banana"]);
});

const requiredStates = () => fruits.map((fruit) => box(fruit).required);

test("required: every enabled item is required while none is checked", () => {
  renderGroup({ required: true });

  expect(requiredStates()).toEqual([true, true, true]);
  expect(form().checkValidity()).toBe(false);
});

test("required: checking one lifts it from all, unchecking puts it back", () => {
  renderGroup({ required: true });

  fireEvent.click(box("banana"));

  expect(requiredStates()).toEqual([false, false, false]);
  expect(form().checkValidity()).toBe(true);

  fireEvent.click(box("banana"));

  expect(requiredStates()).toEqual([true, true, true]);
  expect(form().checkValidity()).toBe(false);
});

test("required: the change event already sees the new state", () => {
  renderGroup({ required: true });

  const seen: boolean[][] = [];

  form().addEventListener(
    "change",
    () => seen.push(fruits.map((fruit) => box(fruit).validity.valueMissing)),
    true,
  );

  fireEvent.click(box("apple"));

  expect(seen).toEqual([[false, false, false]]);
});

test("required: a checked disabled item does not count", () => {
  render(
    <form aria-label="f">
      <CheckboxGroup.Root required defaultValue={["apple"]}>
        <CheckboxGroup.Item value="apple" aria-label="apple" disabled />
        <CheckboxGroup.Item value="banana" aria-label="banana" />
        <CheckboxGroup.Item value="cherry" aria-label="cherry" />
      </CheckboxGroup.Root>
    </form>,
  );

  expect(requiredStates()).toEqual([false, true, true]);
  expect(form().checkValidity()).toBe(false);
});

test("required: an item disabled later makes the group required again", () => {
  const group = (appleDisabled: boolean) => (
    <form aria-label="f">
      <CheckboxGroup.Root required value={["apple"]}>
        <CheckboxGroup.Item
          value="apple"
          aria-label="apple"
          disabled={appleDisabled}
        />
        <CheckboxGroup.Item value="banana" aria-label="banana" />
        <CheckboxGroup.Item value="cherry" aria-label="cherry" />
      </CheckboxGroup.Root>
    </form>
  );

  const { rerender } = render(group(false));

  expect(requiredStates()).toEqual([false, false, false]);

  rerender(group(true));

  expect(requiredStates()).toEqual([false, true, true]);
});

test("controlled refusal keeps required in line", async () => {
  const user = userEvent.setup();

  renderGroup({ required: true, value: [] });

  await user.click(box("apple"));

  expect(box("apple")).not.toBeChecked();
  expect(requiredStates()).toEqual([true, true, true]);
});

test("an item a child removes or disables updates the group", async () => {
  let setMode: (mode: "shown" | "disabled" | "gone") => void = () => {};

  const Apple = () => {
    const [mode, set] = useState<"shown" | "disabled" | "gone">("shown");

    setMode = set;

    if (mode === "gone") return null;

    return (
      <CheckboxGroup.Item
        value="apple"
        aria-label="apple"
        disabled={mode === "disabled"}
      />
    );
  };

  render(
    <form aria-label="f">
      <CheckboxGroup.Root required defaultValue={["apple"]}>
        <Apple />
        <CheckboxGroup.Item value="banana" aria-label="banana" />
      </CheckboxGroup.Root>
    </form>,
  );

  expect(box("banana").required).toBe(false);

  act(() => setMode("disabled"));

  await waitFor(() => expect(box("banana").required).toBe(true));

  act(() => setMode("shown"));

  await waitFor(() => expect(box("banana").required).toBe(false));

  act(() => setMode("gone"));

  await waitFor(() => expect(box("banana").required).toBe(true));
});

const renderInField = (
  fieldProps: React.ComponentProps<typeof Field.Root> = {},
  rootProps: React.ComponentProps<typeof CheckboxGroup.Root> = {},
) =>
  render(
    <form aria-label="f" onSubmit={(e) => e.preventDefault()}>
      <Field.Root {...fieldProps}>
        <Field.Label>Fruit</Field.Label>
        <CheckboxGroup.Root name="fruit" {...rootProps}>
          {fruits.map((fruit) => (
            <CheckboxGroup.Item key={fruit} value={fruit} aria-label={fruit} />
          ))}
        </CheckboxGroup.Root>
        <Field.Error data-testid="error" />
      </Field.Root>
      <button type="submit">Send</button>
    </form>,
  );

const customErrors = () =>
  fruits.map((fruit) => box(fruit).validity.customError);

test("is labelled by Field.Label via aria-labelledby", () => {
  renderInField();

  expect(screen.getByRole("group", { name: "Fruit" })).toBeInTheDocument();
});

test("has no aria-required even when required", () => {
  renderInField({ required: true });

  expect(screen.getByRole("group")).not.toHaveAttribute("aria-required");
  expect(requiredStates()).toEqual([true, true, true]);
});

test("inherits disabled and aria-invalid from Field", () => {
  renderInField({ disabled: true, invalid: true });

  expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");

  for (const fruit of fruits) expect(box(fruit)).toBeDisabled();
});

test("an explicit required={false} beats Field required", () => {
  renderInField({ required: true }, { required: false });

  expect(requiredStates()).toEqual([false, false, false]);
});

test("validate receives the checked values joined by commas", async () => {
  const user = userEvent.setup();
  const validate = vi.fn(() => null);

  renderInField({ validate });

  await user.click(box("apple"));
  await user.click(box("cherry"));

  expect(validate).toHaveBeenLastCalledWith("apple,cherry", expect.any(FormData));
});

test("a failing validate marks every item and a passing one clears them all", async () => {
  const user = userEvent.setup();

  renderInField({
    validate: (value) =>
      value.split(",").filter(Boolean).length > 1 ? "Only one" : null,
  });

  await user.click(box("apple"));
  await user.click(box("cherry"));

  expect(customErrors()).toEqual([true, true, true]);

  await user.click(box("cherry"));

  expect(customErrors()).toEqual([false, false, false]);
});

test("validate leaves checkboxes outside the group alone", async () => {
  const user = userEvent.setup();

  render(
    <form aria-label="f">
      <Field.Root validate={() => "Nope"}>
        <Field.Label>Fruit</Field.Label>
        <CheckboxGroup.Root name="fruit">
          <CheckboxGroup.Item value="apple" aria-label="apple" />
        </CheckboxGroup.Root>
      </Field.Root>
      <Checkbox name="fruit" aria-label="loose" />
      <CheckboxGroup.Root name="fruit">
        <CheckboxGroup.Item value="pear" aria-label="pear" />
      </CheckboxGroup.Root>
    </form>,
  );

  await user.click(box("apple"));

  expect(box("apple").validity.customError).toBe(true);
  expect(box("loose").validity.customError).toBe(false);
  expect(box("pear").validity.customError).toBe(false);
});

test("a plain checkbox inside the Root is not part of the group", async () => {
  const user = userEvent.setup();

  render(
    <form aria-label="f">
      <Field.Root required validate={() => "Nope"}>
        <Field.Label>Fruit</Field.Label>
        <CheckboxGroup.Root name="fruit">
          <CheckboxGroup.Item value="apple" aria-label="apple" />
          <input type="checkbox" aria-label="loose" />
        </CheckboxGroup.Root>
      </Field.Root>
    </form>,
  );

  await user.click(box("apple"));

  expect(box("apple").validity.customError).toBe(true);
  expect(box("loose").validity.customError).toBe(false);
  expect(box("loose").required).toBe(false);
});

test("a failed submit shows the error and errorMessages.valueMissing wins", async () => {
  const user = userEvent.setup();

  renderInField({ required: true, errorMessages: { valueMissing: "Pick one" } });

  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(screen.getByTestId("error")).toHaveTextContent("Pick one");
});

test("a revealed error follows a value set by the parent", async () => {
  const user = userEvent.setup();

  const Harness = () => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <form aria-label="f" onSubmit={(e) => e.preventDefault()}>
        <Field.Root required errorMessages={{ valueMissing: "Pick one" }}>
          <Field.Label>Fruit</Field.Label>
          <CheckboxGroup.Root name="fruit" value={value} onValueChange={setValue}>
            {fruits.map((fruit) => (
              <CheckboxGroup.Item key={fruit} value={fruit} aria-label={fruit} />
            ))}
          </CheckboxGroup.Root>
          <Field.Error data-testid="error" />
        </Field.Root>
        <button type="submit">Send</button>
        <button type="button" onClick={() => setValue(["apple"])}>
          Pick apple
        </button>
        <button type="button" onClick={() => setValue([])}>
          Clear
        </button>
      </form>
    );
  };

  render(<Harness />);

  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(screen.getByTestId("error")).toHaveTextContent("Pick one");

  await user.click(screen.getByRole("button", { name: "Pick apple" }));

  expect(screen.queryByText("Pick one")).toBeNull();

  await user.click(screen.getByRole("button", { name: "Clear" }));

  expect(screen.getByText("Pick one")).toBeInTheDocument();
});

const afterReset = () => new Promise((resolve) => setTimeout(resolve, 20));

test("form reset returns to defaultValue and survives a rerender", async () => {
  const Harness = () => {
    const [, force] = useState(0);

    return (
      <form aria-label="f">
        <CheckboxGroup.Root aria-label="Fruit" defaultValue={["apple"]}>
          {fruits.map((fruit) => (
            <CheckboxGroup.Item key={fruit} value={fruit} aria-label={fruit} />
          ))}
        </CheckboxGroup.Root>
        <button type="button" onClick={() => force((n) => n + 1)}>
          rerender
        </button>
      </form>
    );
  };

  render(<Harness />);

  fireEvent.click(box("apple"));
  fireEvent.click(box("cherry"));

  form().reset();
  await afterReset();

  expect(box("apple")).toBeChecked();
  expect(box("cherry")).not.toBeChecked();

  fireEvent.click(screen.getByText("rerender"));

  expect(box("apple")).toBeChecked();
  expect(box("cherry")).not.toBeChecked();
});

test("form reset of an empty group does not report a change", async () => {
  const onValueChange = vi.fn();

  renderGroup({ onValueChange });

  form().reset();
  await afterReset();

  expect(onValueChange).not.toHaveBeenCalled();
});

test("a canceled form reset keeps the checked values", async () => {
  render(
    <form aria-label="f" onReset={(e) => e.preventDefault()}>
      <CheckboxGroup.Root aria-label="Fruit">
        <CheckboxGroup.Item value="apple" aria-label="apple" />
      </CheckboxGroup.Root>
    </form>,
  );

  fireEvent.click(box("apple"));

  form().reset();
  await afterReset();

  expect(box("apple")).toBeChecked();
});

test("reset puts required back", async () => {
  renderGroup({ required: true });

  fireEvent.click(box("banana"));

  expect(requiredStates()).toEqual([false, false, false]);

  form().reset();
  await afterReset();

  expect(box("banana")).not.toBeChecked();
  expect(requiredStates()).toEqual([true, true, true]);
});

test("an item whose value a child changes in place updates required", () => {
  let rename: (value: string) => void = () => {};

  const Renamable = () => {
    const [value, setValue] = useState("apple");

    rename = setValue;

    return <CheckboxGroup.Item value={value} aria-label="renamable" />;
  };

  render(
    <form aria-label="f">
      <CheckboxGroup.Root required defaultValue={["apple"]}>
        <Renamable />
        <CheckboxGroup.Item value="banana" aria-label="banana" />
      </CheckboxGroup.Root>
    </form>,
  );

  expect(box("banana").required).toBe(false);

  act(() => rename("pear"));

  expect(box("renamable")).not.toBeChecked();
  expect(box("banana").required).toBe(true);
  expect(form().checkValidity()).toBe(false);
});

test("a shown error goes away when a child removes every item", async () => {
  const user = userEvent.setup();
  let clear: () => void = () => {};

  const Items = () => {
    const [shown, setShown] = useState(true);

    clear = () => setShown(false);

    if (!shown) return null;

    return fruits.map((fruit) => (
      <CheckboxGroup.Item key={fruit} value={fruit} aria-label={fruit} />
    ));
  };

  render(
    <form aria-label="f" onSubmit={(e) => e.preventDefault()}>
      <Field.Root required errorMessages={{ valueMissing: "Pick one" }}>
        <Field.Label>Fruit</Field.Label>
        <CheckboxGroup.Root name="fruit">
          <Items />
        </CheckboxGroup.Root>
        <Field.Error />
      </Field.Root>
      <button type="submit">Send</button>
    </form>,
  );

  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(screen.getByText("Pick one")).toBeInTheDocument();

  act(() => clear());

  await waitFor(() => expect(screen.queryByText("Pick one")).toBeNull());
});

test("a fieldset inside the group that a child disables updates required", async () => {
  let lock: (locked: boolean) => void = () => {};

  const Locked = () => {
    const [locked, setLocked] = useState(false);

    lock = setLocked;

    return (
      <fieldset disabled={locked}>
        <CheckboxGroup.Item value="apple" aria-label="apple" />
      </fieldset>
    );
  };

  render(
    <form aria-label="f">
      <CheckboxGroup.Root required defaultValue={["apple"]}>
        <Locked />
        <CheckboxGroup.Item value="banana" aria-label="banana" />
      </CheckboxGroup.Root>
    </form>,
  );

  expect(box("banana").required).toBe(false);

  act(() => lock(true));

  await waitFor(() => expect(box("banana").required).toBe(true));
  expect(form().checkValidity()).toBe(false);
});
