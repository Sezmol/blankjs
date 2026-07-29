import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { PinInput } from "./index";
import { Field } from "../field";
import { Form } from "../form";

const cells = () => screen.getAllByRole("textbox");

const proxy = (container: HTMLElement) =>
  container.querySelector<HTMLInputElement>('input[aria-hidden="true"]')!;

test("renders one cell per length plus a form proxy", () => {
  const { container } = render(<PinInput name="code" length={4} />);

  expect(cells()).toHaveLength(4);
  expect(proxy(container).name).toBe("code");
});

test("typing fills cells and walks focus forward", async () => {
  const user = userEvent.setup();
  const { container } = render(<PinInput length={4} />);

  await user.click(cells()[0]!);
  await user.keyboard("12");

  expect(cells()[0]).toHaveValue("1");
  expect(cells()[1]).toHaveValue("2");
  expect(cells()[2]).toHaveFocus();
  expect(proxy(container)).toHaveValue("12");
});

test("typing over a filled cell replaces it instead of appending", async () => {
  const user = userEvent.setup();
  const { container } = render(<PinInput length={4} defaultValue="1234" />);

  await user.click(cells()[1]!);
  await user.keyboard("9");

  expect(proxy(container)).toHaveValue("1934");
});

test("rejects characters the type does not allow", async () => {
  const user = userEvent.setup();
  const { container } = render(<PinInput length={4} />);

  await user.click(cells()[0]!);
  await user.keyboard("a1");

  expect(cells()[0]).toHaveValue("1");
  expect(proxy(container)).toHaveValue("1");
});

test("alphanumeric accepts letters", async () => {
  const user = userEvent.setup();
  const { container } = render(<PinInput length={4} type="alphanumeric" />);

  await user.click(cells()[0]!);
  await user.keyboard("a1");

  expect(proxy(container)).toHaveValue("a1");
});

test("Backspace clears the current cell, then walks back", async () => {
  const user = userEvent.setup();
  const { container } = render(<PinInput length={4} defaultValue="12" />);

  await user.click(cells()[1]!);
  await user.keyboard("{Backspace}");

  expect(proxy(container)).toHaveValue("1");
  expect(cells()[1]).toHaveFocus();

  await user.keyboard("{Backspace}");

  expect(proxy(container)).toHaveValue("");
  expect(cells()[0]).toHaveFocus();
});

test("arrows, Home and End move focus", async () => {
  const user = userEvent.setup();
  render(<PinInput length={4} defaultValue="12" />);

  await user.click(cells()[0]!);
  await user.keyboard("{ArrowRight}");
  expect(cells()[1]).toHaveFocus();

  await user.keyboard("{ArrowLeft}");
  expect(cells()[0]).toHaveFocus();

  await user.keyboard("{End}");
  expect(cells()[2]).toHaveFocus();

  await user.keyboard("{Home}");
  expect(cells()[0]).toHaveFocus();
});

test("paste spreads across cells and drops separators", async () => {
  const user = userEvent.setup();
  const { container } = render(<PinInput length={6} />);

  await user.click(cells()[0]!);
  await user.paste("789-012");

  expect(proxy(container)).toHaveValue("789012");
  expect(cells()[5]).toHaveValue("2");
});

test("a multi-character change spreads, which is how autofill arrives", () => {
  const { container } = render(<PinInput length={6} />);

  fireEvent.change(cells()[0]!, { target: { value: "123456" } });

  expect(proxy(container)).toHaveValue("123456");
  expect(cells()[3]).toHaveValue("4");
});

test("onComplete fires once the last cell is filled", async () => {
  const user = userEvent.setup();
  const onComplete = vi.fn();

  render(<PinInput length={4} onComplete={onComplete} />);

  await user.click(cells()[0]!);
  await user.keyboard("123");

  expect(onComplete).not.toHaveBeenCalled();

  await user.keyboard("4");

  expect(onComplete).toHaveBeenCalledExactlyOnceWith("1234");
});

test("focusing a cell past the filled prefix falls back to the first empty one", async () => {
  const user = userEvent.setup();

  render(<PinInput length={6} defaultValue="12" />);

  await user.click(cells()[5]!);

  expect(cells()[2]).toHaveFocus();
});

test("a form reset restores the default value", async () => {
  const user = userEvent.setup();

  const { container } = render(
    <form>
      <PinInput length={4} defaultValue="11" />
      <button type="reset">Reset</button>
    </form>,
  );

  await user.click(cells()[2]!);
  await user.keyboard("9");

  expect(proxy(container)).toHaveValue("119");

  await user.click(screen.getByRole("button", { name: "Reset" }));

  expect(proxy(container)).toHaveValue("11");
});

test("an incomplete value fails validation and blocks submit", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  const { container } = render(
    <Form onSubmit={onSubmit}>
      <PinInput name="code" length={6} required defaultValue="12" />
      <button type="submit">Go</button>
    </Form>,
  );

  expect(proxy(container).checkValidity()).toBe(false);

  await user.click(screen.getByRole("button", { name: "Go" }));

  expect(onSubmit).not.toHaveBeenCalled();
});

test("a complete value passes validation", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  const { container } = render(
    <Form onSubmit={onSubmit}>
      <PinInput name="code" length={6} required defaultValue="123456" />
      <button type="submit">Go</button>
    </Form>,
  );

  expect(proxy(container).checkValidity()).toBe(true);

  await user.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  expect(onSubmit.mock.calls[0]![0].get("code")).toBe("123456");
});

test("groups render a separator between them", () => {
  const { container } = render(<PinInput length={6} groups={[3, 3]} />);

  expect(container.querySelectorAll(".bk-pin-input-group")).toHaveLength(2);
  expect(container.querySelectorAll(".bk-pin-input-separator")).toHaveLength(1);
  expect(cells()).toHaveLength(6);
});

test("groups that do not add up still render every cell", () => {
  render(<PinInput length={6} groups={[2]} />);

  expect(cells()).toHaveLength(6);
});

test("mask renders password cells", () => {
  const { container } = render(<PinInput length={4} mask />);

  expect(container.querySelectorAll('input[type="password"]')).toHaveLength(4);
});

test("controlled value only changes through the handler", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();

  render(<PinInput length={4} value="12" onValueChange={onValueChange} />);

  await user.click(cells()[2]!);
  await user.keyboard("9");

  expect(onValueChange).toHaveBeenCalledWith("129");
  expect(cells()[2]).toHaveValue("");
});

test("a controlled parent drives every cell", async () => {
  const user = userEvent.setup();

  const Controlled = () => {
    const [value, setValue] = useState("");

    return <PinInput length={4} value={value} onValueChange={setValue} />;
  };

  render(<Controlled />);

  await user.click(cells()[0]!);
  await user.keyboard("12");

  expect(cells()[0]).toHaveValue("1");
  expect(cells()[1]).toHaveValue("2");
});

test("disabled comes from Field and reaches every cell", () => {
  const { container } = render(
    <Field.Root disabled>
      <Field.Label>Code</Field.Label>
      <PinInput name="code" length={4} />
    </Field.Root>,
  );

  for (const cell of container.querySelectorAll("input")) {
    expect(cell).toBeDisabled();
  }
});

test("the group is labelled by the Field label", () => {
  render(
    <Field.Root>
      <Field.Label>Verification code</Field.Label>
      <PinInput name="code" length={4} />
    </Field.Root>,
  );

  expect(screen.getByRole("group")).toHaveAccessibleName("Verification code");
});

// The browser must not edit a cell itself: a cell is controlled, so any commit
// landing between beforeinput and input rewrites its value and eats the
// keystroke. Field.Root used to schedule exactly such a commit (bug-050).
test("beforeinput is taken over instead of letting the browser insert", () => {
  const { container } = render(<PinInput length={4} />);

  const event = new Event("beforeinput", { bubbles: true, cancelable: true });

  Object.defineProperty(event, "inputType", { value: "insertText" });
  Object.defineProperty(event, "data", { value: "7" });

  fireEvent(cells()[0]!, event);

  expect(event.defaultPrevented).toBe(true);
  expect(proxy(container)).toHaveValue("7");
});

// a soft keyboard often sends no usable key for Backspace, only beforeinput.
// On desktop onKeyDown prevents the default, so this path never runs there.
test("a deletion arriving only as beforeinput still removes a character", () => {
  const { container } = render(<PinInput length={4} defaultValue="12" />);

  const event = new Event("beforeinput", { bubbles: true, cancelable: true });

  Object.defineProperty(event, "inputType", { value: "deleteContentBackward" });

  fireEvent(cells()[1]!, event);

  expect(event.defaultPrevented).toBe(true);
  expect(proxy(container)).toHaveValue("1");
});

test("changing groups remounts a cell and it still accepts input", () => {
  const Wrapper = () => {
    const [groups, setGroups] = useState<number[]>([3, 3]);

    return (
      <>
        <button onClick={() => setGroups([2, 4])}>Regroup</button>
        <PinInput name="code" length={6} groups={groups} defaultValue="12" />
      </>
    );
  };

  const { container } = render(<Wrapper />);

  // cell 2 sits in the first group under [3, 3] and in the second under [2, 4],
  // so React tears the input down and builds a new one
  const before = cells()[2];

  fireEvent.click(screen.getByRole("button", { name: "Regroup" }));

  expect(cells()[2]).not.toBe(before);

  const event = new Event("beforeinput", { bubbles: true, cancelable: true });

  Object.defineProperty(event, "inputType", { value: "insertText" });
  Object.defineProperty(event, "data", { value: "5" });

  fireEvent(cells()[2]!, event);

  expect(event.defaultPrevented).toBe(true);
  expect(proxy(container)).toHaveValue("125");
});

test("typing survives a re-render committed mid-keystroke", () => {
  const Wrapper = () => {
    const [, force] = useState(0);

    return (
      <div onKeyDownCapture={() => force((n) => n + 1)}>
        <PinInput name="code" length={4} />
      </div>
    );
  };

  const { container } = render(<Wrapper />);

  fireEvent.keyDown(cells()[0]!, { key: "9" });

  const event = new Event("beforeinput", { bubbles: true, cancelable: true });

  Object.defineProperty(event, "inputType", { value: "insertText" });
  Object.defineProperty(event, "data", { value: "9" });

  fireEvent(cells()[0]!, event);

  expect(proxy(container)).toHaveValue("9");
});

test("an explicit role beats the default", () => {
  render(<PinInput length={2} role="presentation" />);

  expect(screen.queryByRole("group")).toBeNull();
});

test("an explicit prop still beats the Field context", () => {
  render(
    <Field.Root disabled>
      <Field.Label>Code</Field.Label>
      <PinInput name="code" length={2} disabled={false} />
    </Field.Root>,
  );

  expect(cells()[0]).toBeEnabled();
});
