import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Popover } from "./index";
import { Button } from "../button";

const shown = new WeakSet<HTMLElement>();

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

    return originalMatches.call(this, selector);
  } as typeof Element.prototype.matches;
});

const isShown = (el: HTMLElement) => el.matches(":popover-open");

const renderPopover = (
  rootProps: Partial<React.ComponentProps<typeof Popover.Root>> = {},
) =>
  render(
    <Popover.Root {...rootProps}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content">Hello</Popover.Content>
    </Popover.Root>,
  );

const content = () => screen.getByTestId("content");

test("wires trigger to content through popovertarget", () => {
  renderPopover();

  const trigger = screen.getByRole("button", { name: "Open" });

  expect(content()).toHaveAttribute("popover", "auto");
  expect(trigger).toHaveAttribute("popovertarget", content().id);
  expect(trigger).toHaveAttribute("type", "button");
});

test("asChild trigger spreads onto the child instead of a button", () => {
  render(
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button data-testid="btn">Open</Button>
      </Popover.Trigger>
      <Popover.Content data-testid="content">Hello</Popover.Content>
    </Popover.Root>,
  );

  const btn = screen.getByTestId("btn");

  expect(btn.tagName).toBe("BUTTON");
  expect(btn).toHaveClass("bk-button");
  expect(btn).toHaveAttribute("popovertarget", content().id);
});

test("defaultOpen shows the popover on mount", () => {
  renderPopover({ defaultOpen: true });

  expect(isShown(content())).toBe(true);
});

test("a browser-initiated open syncs into state without a double show", () => {
  const onOpenChange = vi.fn();

  renderPopover({ onOpenChange });

  act(() => content().showPopover());

  expect(onOpenChange).toHaveBeenCalledWith(true);
  expect(isShown(content())).toBe(true);
});

test("a browser-initiated close (light dismiss) syncs into state", () => {
  const onOpenChange = vi.fn();

  renderPopover({ defaultOpen: true, onOpenChange });

  act(() => content().hidePopover());

  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(isShown(content())).toBe(false);
});

test("controlled open drives show and hide", () => {
  const Controlled = () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button onClick={() => setOpen((o) => !o)}>toggle</button>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content data-testid="content">Hello</Popover.Content>
        </Popover.Root>
      </>
    );
  };

  render(<Controlled />);

  const toggle = screen.getByRole("button", { name: "toggle" });

  fireEvent.click(toggle);
  expect(isShown(content())).toBe(true);

  fireEvent.click(toggle);
  expect(isShown(content())).toBe(false);
});

test("onToggle veto keeps the state untouched", () => {
  const onOpenChange = vi.fn();

  render(
    <Popover.Root onOpenChange={onOpenChange}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content" onToggle={(e) => e.preventDefault()}>
        Hello
      </Popover.Content>
    </Popover.Root>,
  );

  act(() => content().showPopover());

  expect(onOpenChange).not.toHaveBeenCalled();
});

test("close button targets the content with a hide action", () => {
  render(
    <Popover.Root defaultOpen>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content">
        <Popover.Close data-testid="close">Close</Popover.Close>
      </Popover.Content>
    </Popover.Root>,
  );

  const close = screen.getByTestId("close");

  expect(close).toHaveAttribute("popovertarget", content().id);
  expect(close).toHaveAttribute("popovertargetaction", "hide");
  expect(close).toHaveAttribute("type", "button");
});

test("asChild close spreads onto the child", () => {
  render(
    <Popover.Root>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content">
        <Popover.Close asChild>
          <Button data-testid="close">Close</Button>
        </Popover.Close>
      </Popover.Content>
    </Popover.Root>,
  );

  const close = screen.getByTestId("close");

  expect(close).toHaveClass("bk-button");
  expect(close).toHaveAttribute("popovertargetaction", "hide");
});

test("parts outside Root throw", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => render(<Popover.Content>x</Popover.Content>)).toThrow(
    /within Popover.Root/,
  );

  spy.mockRestore();
});
