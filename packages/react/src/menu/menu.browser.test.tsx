import { render, screen } from "@testing-library/react";
import { page, userEvent } from "vitest/browser";
import { Menu } from "./index";
import "../styles.css";

test("a controlled menu stays closed while the parent keeps it closed", async () => {
  render(
    <Menu.Root open={false} onOpenChange={() => {}}>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content data-testid="content">
        <Menu.Item>Edit</Menu.Item>
      </Menu.Content>
    </Menu.Root>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Actions" }));

  await expect
    .poll(() => screen.getByTestId("content").matches(":popover-open"))
    .toBe(false);
});

const PinnedMenu = ({
  onKeyDown,
}: {
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) => (
  <Menu.Root open onOpenChange={() => {}}>
    <Menu.Trigger onKeyDown={onKeyDown}>Actions</Menu.Trigger>
    <Menu.Content data-testid="content">
      <Menu.Item>Edit</Menu.Item>
      <Menu.Item>Delete</Menu.Item>
    </Menu.Content>
  </Menu.Root>
);

const trigger = () => screen.getByRole("button", { name: "Actions" });

const content = () => screen.getByTestId("content");

const dismiss = async () => {
  await expect.poll(() => content().matches(":popover-open")).toBe(true);
  await userEvent.click(page.elementLocator(document.body), {
    position: { x: window.innerWidth - 4, y: window.innerHeight - 4 },
  });
  await expect.poll(() => content().matches(":popover-open")).toBe(false);
};

test("a pinned menu closed by light dismiss reports aria-expanded false", async () => {
  render(<PinnedMenu />);

  await dismiss();

  expect(trigger().getAttribute("aria-expanded")).toBe("false");
});

test("clicking the trigger of a dismissed pinned menu moves focus in", async () => {
  render(<PinnedMenu />);

  await dismiss();
  await userEvent.click(trigger());

  await expect.poll(() => document.activeElement).toBe(content());
  expect(trigger().getAttribute("aria-expanded")).toBe("true");
});

test("ArrowUp on the trigger of a dismissed pinned menu opens it on the last item", async () => {
  render(<PinnedMenu />);

  await dismiss();
  trigger().focus();
  await userEvent.keyboard("{ArrowUp}");

  await expect.poll(() => content().matches(":popover-open")).toBe(true);
  await expect.poll(() => document.activeElement).toBe(content());
  expect(content().getAttribute("aria-activedescendant")).toBe(
    screen.getByRole("menuitem", { name: "Delete" }).id,
  );
});

test("Enter on the trigger of a dismissed pinned menu opens it once", async () => {
  render(<PinnedMenu />);

  await dismiss();

  const seen: string[] = [];

  content().addEventListener("toggle", (e) => {
    seen.push((e as ToggleEvent).newState);
  });
  trigger().focus();
  await userEvent.keyboard("{Enter}");
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(seen).toEqual(["open"]);
});

test("a trigger keydown the consumer cancels opens nothing", async () => {
  render(<PinnedMenu onKeyDown={(e) => e.preventDefault()} />);

  await dismiss();
  trigger().focus();
  await userEvent.keyboard("{ArrowDown}");
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(content().matches(":popover-open")).toBe(false);
});
