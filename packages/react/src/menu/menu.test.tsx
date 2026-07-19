import { act, fireEvent, render, screen } from "@testing-library/react";
import { Menu } from "./index";
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

const renderMenu = (
  rootProps: Partial<React.ComponentProps<typeof Menu.Root>> = {},
  itemProps: Partial<React.ComponentProps<typeof Menu.Item>> = {},
) =>
  render(
    <Menu.Root {...rootProps}>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content data-testid="content">
        <Menu.Item {...itemProps}>Rename</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>,
  );

const content = () => screen.getByTestId("content");
const trigger = () => screen.getByRole("button", { name: "Actions" });
const isShown = (el: HTMLElement) => el.matches(":popover-open");
const activeId = () => content().getAttribute("aria-activedescendant");
const item = (name: string) => screen.getByText(name);

test("renders menu roles and trigger wiring", () => {
  renderMenu();

  expect(content()).toHaveAttribute("role", "menu");
  expect(content()).toHaveAttribute("popover", "auto");
  expect(content()).toHaveAttribute("tabindex", "-1");
  expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
  expect(trigger()).toHaveAttribute("aria-expanded", "false");
  expect(trigger()).toHaveAttribute("aria-controls", content().id);
  expect(trigger()).toHaveAttribute("popovertarget", content().id);
  expect(item("Rename")).toHaveAttribute("role", "menuitem");
});

test("ArrowDown opens with the first item active and focuses the menu", () => {
  renderMenu();

  fireEvent.keyDown(trigger(), { key: "ArrowDown" });

  expect(isShown(content())).toBe(true);
  expect(trigger()).toHaveAttribute("aria-expanded", "true");
  expect(activeId()).toBe(item("Rename").id);
  expect(content()).toHaveFocus();
});

test("ArrowUp opens with the last item active", () => {
  renderMenu();

  fireEvent.keyDown(trigger(), { key: "ArrowUp" });

  expect(activeId()).toBe(item("Delete").id);
});

test("arrows move the highlight and stop at the edges", () => {
  renderMenu({ defaultOpen: true });

  fireEvent.keyDown(content(), { key: "ArrowDown" });
  expect(activeId()).toBe(item("Rename").id);

  fireEvent.keyDown(content(), { key: "ArrowDown" });
  fireEvent.keyDown(content(), { key: "ArrowDown" });
  fireEvent.keyDown(content(), { key: "ArrowDown" });
  expect(activeId()).toBe(item("Delete").id);

  fireEvent.keyDown(content(), { key: "End" });
  expect(activeId()).toBe(item("Delete").id);

  fireEvent.keyDown(content(), { key: "Home" });
  expect(activeId()).toBe(item("Rename").id);
});

test("Enter activates the highlighted item and the click closes the menu", () => {
  const onClick = vi.fn();

  renderMenu({ defaultOpen: true }, { onClick });

  fireEvent.keyDown(content(), { key: "ArrowDown" });
  fireEvent.keyDown(content(), { key: "Enter" });

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(isShown(content())).toBe(false);
});

test("clicking an item runs its onClick and closes", () => {
  const onClick = vi.fn();

  renderMenu({ defaultOpen: true }, { onClick });

  fireEvent.click(item("Rename"));

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(isShown(content())).toBe(false);
});

test("preventDefault in item onClick keeps the menu open", () => {
  renderMenu({ defaultOpen: true }, { onClick: (e) => e.preventDefault() });

  fireEvent.click(item("Rename"));

  expect(isShown(content())).toBe(true);
});

test("disabled item neither fires onClick nor participates in navigation", () => {
  const onClick = vi.fn();

  renderMenu({ defaultOpen: true }, { disabled: true, onClick });

  fireEvent.click(item("Rename"));
  expect(onClick).not.toHaveBeenCalled();
  expect(isShown(content())).toBe(true);

  fireEvent.keyDown(content(), { key: "Home" });
  expect(activeId()).toBe(item("Duplicate").id);
});

test("hover highlights an item, leaving the menu clears it", () => {
  renderMenu({ defaultOpen: true });

  const e = new Event("pointerover", { bubbles: true });

  fireEvent(item("Duplicate"), e);
  expect(activeId()).toBe(item("Duplicate").id);

  fireEvent(content(), new Event("pointerout", { bubbles: true }));
  expect(activeId()).toBeNull();
});

test("reopening starts with no highlight", () => {
  renderMenu();

  fireEvent.keyDown(trigger(), { key: "ArrowDown" });
  fireEvent.keyDown(content(), { key: "Tab" });
  expect(isShown(content())).toBe(false);

  act(() => content().showPopover());
  expect(activeId()).toBeNull();
});

test("closing returns focus to the trigger when it was inside the menu", () => {
  renderMenu();

  fireEvent.keyDown(trigger(), { key: "ArrowDown" });
  expect(content()).toHaveFocus();

  fireEvent.keyDown(content(), { key: "Tab" });
  expect(trigger()).toHaveFocus();
});

test("a browser-initiated close (light dismiss) syncs into state", () => {
  const onOpenChange = vi.fn();

  renderMenu({ defaultOpen: true, onOpenChange });

  act(() => content().hidePopover());

  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(trigger()).toHaveAttribute("aria-expanded", "false");
});

test("asChild trigger spreads onto the child", () => {
  render(
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button data-testid="btn">Actions</Button>
      </Menu.Trigger>
      <Menu.Content data-testid="content">
        <Menu.Item>Rename</Menu.Item>
      </Menu.Content>
    </Menu.Root>,
  );

  const btn = screen.getByTestId("btn");

  expect(btn).toHaveClass("bk-button");
  expect(btn).toHaveAttribute("aria-haspopup", "menu");
  expect(btn).toHaveAttribute("popovertarget", content().id);
});

test("parts outside Root throw", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => render(<Menu.Content>x</Menu.Content>)).toThrow(
    /within Menu.Root/,
  );

  spy.mockRestore();
});
