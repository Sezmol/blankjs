import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Popover } from "./index";
import { Menu } from "../menu";
import "../styles.css";

const openings = (element: HTMLElement) => {
  const seen: string[] = [];

  element.addEventListener("toggle", (e) => {
    seen.push((e as ToggleEvent).newState);
  });

  return seen;
};

test("a Popover the parent keeps closed never shows, even for a frame", async () => {
  const onOpenChange = vi.fn();

  render(
    <Popover.Root open={false} onOpenChange={onOpenChange}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content">Body</Popover.Content>
    </Popover.Root>,
  );

  const seen = openings(screen.getByTestId("content"));

  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(seen).toEqual([]);
  expect(onOpenChange).toHaveBeenCalledTimes(1);
  expect(onOpenChange).toHaveBeenCalledWith(true);
});

test("a kept-closed Popover does not close another open popover", async () => {
  render(
    <>
      <Popover.Root defaultOpen>
        <Popover.Trigger>First</Popover.Trigger>
        <Popover.Content data-testid="first">First body</Popover.Content>
      </Popover.Root>
      <Popover.Root open={false} onOpenChange={() => {}}>
        <Popover.Trigger>Second</Popover.Trigger>
        <Popover.Content data-testid="second">Second body</Popover.Content>
      </Popover.Root>
    </>,
  );

  await expect
    .poll(() => screen.getByTestId("first").matches(":popover-open"))
    .toBe(true);

  screen.getByTestId("second").showPopover();
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(screen.getByTestId("first").matches(":popover-open")).toBe(true);
  expect(screen.getByTestId("second").matches(":popover-open")).toBe(false);
});

test("an uncontrolled Popover still opens on click and reports it once", async () => {
  const onOpenChange = vi.fn();

  render(
    <Popover.Root onOpenChange={onOpenChange}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content">Body</Popover.Content>
    </Popover.Root>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  await expect
    .poll(() => screen.getByTestId("content").matches(":popover-open"))
    .toBe(true);
  expect(onOpenChange).toHaveBeenCalledTimes(1);
});

test("a Menu the parent keeps closed never shows", async () => {
  render(
    <Menu.Root open={false} onOpenChange={() => {}}>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content data-testid="menu">
        <Menu.Item>Edit</Menu.Item>
      </Menu.Content>
    </Menu.Root>,
  );

  const seen = openings(screen.getByTestId("menu"));

  await userEvent.click(screen.getByRole("button", { name: "Actions" }));
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(seen).toEqual([]);
});

const KeptClosed = ({
  onOpenChange,
  mounted = true,
}: {
  onOpenChange: (open: boolean) => void;
  mounted?: boolean;
}) =>
  mounted ? (
    <Popover.Root open={false} onOpenChange={onOpenChange}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content">Body</Popover.Content>
    </Popover.Root>
  ) : null;

test("an open request does not outlive the Popover", async () => {
  const onOpenChange = vi.fn();
  const { rerender } = render(<KeptClosed onOpenChange={onOpenChange} />);

  screen.getByRole("button", { name: "Open" }).click();
  rerender(<KeptClosed onOpenChange={onOpenChange} mounted={false} />);
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(onOpenChange).not.toHaveBeenCalled();
});

test("two opening attempts in one task make one request", async () => {
  const onOpenChange = vi.fn();

  render(<KeptClosed onOpenChange={onOpenChange} />);

  screen.getByTestId("content").showPopover();
  screen.getByTestId("content").showPopover();
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(onOpenChange).toHaveBeenCalledTimes(1);
});
