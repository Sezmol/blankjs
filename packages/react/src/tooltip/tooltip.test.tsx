import { act, fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "./index";
import { Button } from "../button";

const shown = new WeakSet<HTMLElement>();

let focusVisible = false;

const fireToggle = (el: HTMLElement, newState: "open" | "closed") => {
  const e = new Event("toggle", { cancelable: true });

  Object.assign(e, {
    newState,
    oldState: newState === "open" ? "closed" : "open",
  });

  el.dispatchEvent(e);
};

beforeAll(() => {
  HTMLElement.prototype.showPopover = function () {
    if (shown.has(this)) {
      throw new DOMException("already showing", "InvalidStateError");
    }

    shown.add(this);
    fireToggle(this, "open");
  };

  HTMLElement.prototype.hidePopover = function () {
    if (!shown.has(this)) {
      throw new DOMException("already hidden", "InvalidStateError");
    }

    shown.delete(this);
    fireToggle(this, "closed");
  };

  const originalMatches = Element.prototype.matches;

  Element.prototype.matches = function (this: Element, selector: string) {
    if (selector === ":popover-open") return shown.has(this as HTMLElement);
    if (selector === ":focus-visible") return focusVisible;

    return originalMatches.call(this, selector);
  } as typeof Element.prototype.matches;
});

beforeEach(() => {
  vi.useFakeTimers();
  focusVisible = false;
});

afterEach(() => {
  vi.useRealTimers();
});

const firePointer = (
  el: Element,
  type: "pointerover" | "pointerout",
  pointerType = "mouse",
) => {
  const e = new Event(type, { bubbles: true });

  Object.assign(e, { pointerType });

  fireEvent(el, e);
};

const renderTooltip = (
  rootProps: Partial<React.ComponentProps<typeof Tooltip.Root>> = {},
) =>
  render(
    <Tooltip.Root {...rootProps}>
      <Tooltip.Trigger>Save</Tooltip.Trigger>
      <Tooltip.Content data-testid="content">Saves the file</Tooltip.Content>
    </Tooltip.Root>,
  );

const content = () => screen.getByTestId("content");
const trigger = () => screen.getByRole("button", { name: "Save" });
const isShown = (el: HTMLElement) => el.matches(":popover-open");

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

test("renders hint popover with role tooltip and aria-describedby wiring", () => {
  renderTooltip();

  expect(content()).toHaveAttribute("popover", "hint");
  expect(content()).toHaveAttribute("role", "tooltip");
  expect(trigger()).toHaveAttribute("aria-describedby", content().id);
  expect(trigger()).not.toHaveAttribute("popovertarget");
});

test("hover opens after the delay, not before", () => {
  renderTooltip();

  firePointer(trigger(), "pointerover");

  advance(499);
  expect(isShown(content())).toBe(false);

  advance(1);
  expect(isShown(content())).toBe(true);
});

test("leaving before the delay cancels the pending open", () => {
  renderTooltip();

  firePointer(trigger(), "pointerover");
  advance(300);
  firePointer(trigger(), "pointerout");

  advance(1000);
  expect(isShown(content())).toBe(false);
});

test("leaving the trigger closes after the close delay", () => {
  renderTooltip();

  firePointer(trigger(), "pointerover");
  advance(600);

  firePointer(trigger(), "pointerout");
  expect(isShown(content())).toBe(true);

  advance(100);
  expect(isShown(content())).toBe(false);
});

test("hovering the content keeps the tooltip open (WCAG 1.4.13)", () => {
  renderTooltip();

  firePointer(trigger(), "pointerover");
  advance(600);

  firePointer(trigger(), "pointerout");
  firePointer(content(), "pointerover");

  advance(500);
  expect(isShown(content())).toBe(true);

  firePointer(content(), "pointerout");
  advance(100);
  expect(isShown(content())).toBe(false);
});

test("touch pointer does not open the tooltip", () => {
  renderTooltip();

  firePointer(trigger(), "pointerover", "touch");

  advance(1000);
  expect(isShown(content())).toBe(false);
});

test("a neighboring tooltip opens without delay right after one closed", () => {
  render(
    <>
      <Tooltip.Root>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content data-testid="first">Saves</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>Undo</Tooltip.Trigger>
        <Tooltip.Content data-testid="second">Undoes</Tooltip.Content>
      </Tooltip.Root>
    </>,
  );

  const first = screen.getByRole("button", { name: "Save" });
  const second = screen.getByRole("button", { name: "Undo" });

  firePointer(first, "pointerover");
  advance(500);
  expect(isShown(screen.getByTestId("first"))).toBe(true);

  firePointer(first, "pointerout");
  firePointer(second, "pointerover");

  advance(0);
  expect(isShown(screen.getByTestId("second"))).toBe(true);
});

test("keyboard focus opens immediately, mouse focus does not", () => {
  renderTooltip();

  fireEvent.focus(trigger());
  expect(isShown(content())).toBe(false);

  fireEvent.blur(trigger());

  focusVisible = true;
  fireEvent.focus(trigger());
  expect(isShown(content())).toBe(true);
});

test("blur closes immediately", () => {
  renderTooltip();

  focusVisible = true;
  fireEvent.focus(trigger());
  expect(isShown(content())).toBe(true);

  fireEvent.blur(trigger());
  expect(isShown(content())).toBe(false);
});

test("Escape closes and cancels a pending open", () => {
  renderTooltip();

  focusVisible = true;
  fireEvent.focus(trigger());
  firePointer(trigger(), "pointerover");

  fireEvent.keyDown(trigger(), { key: "Escape" });
  expect(isShown(content())).toBe(false);

  advance(1000);
  expect(isShown(content())).toBe(false);
});

test("delay prop overrides the default open delay", () => {
  renderTooltip({ delay: 50 });

  firePointer(trigger(), "pointerover");

  advance(50);
  expect(isShown(content())).toBe(true);
});

test("controlled open drives show and hide", () => {
  const onOpenChange = vi.fn();

  const { rerender } = render(
    <Tooltip.Root open={false} onOpenChange={onOpenChange}>
      <Tooltip.Trigger>Save</Tooltip.Trigger>
      <Tooltip.Content data-testid="content">Saves</Tooltip.Content>
    </Tooltip.Root>,
  );

  rerender(
    <Tooltip.Root open onOpenChange={onOpenChange}>
      <Tooltip.Trigger>Save</Tooltip.Trigger>
      <Tooltip.Content data-testid="content">Saves</Tooltip.Content>
    </Tooltip.Root>,
  );

  expect(isShown(content())).toBe(true);
});

test("asChild trigger spreads onto the child instead of a button", () => {
  render(
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button data-testid="btn">Save</Button>
      </Tooltip.Trigger>
      <Tooltip.Content data-testid="content">Saves</Tooltip.Content>
    </Tooltip.Root>,
  );

  const btn = screen.getByTestId("btn");

  expect(btn).toHaveClass("bk-button");
  expect(btn).toHaveAttribute("aria-describedby", content().id);
});

test("parts outside Root throw", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => render(<Tooltip.Content>x</Tooltip.Content>)).toThrow(
    /within Tooltip.Root/,
  );

  spy.mockRestore();
});
