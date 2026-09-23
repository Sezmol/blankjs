import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Popover } from "./index";
import "../styles.css";

const renderAt = (top: string) =>
  render(
    <div style={{ position: "fixed", top, left: "20px" }}>
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content data-testid="content">
          <div style={{ width: "200px", height: "300px" }}>Body</div>
        </Popover.Content>
      </Popover.Root>
    </div>,
  );

const content = () => screen.getByTestId("content");

test("opens below the trigger and grows from its top edge", async () => {
  renderAt("20px");

  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  const trigger = screen.getByRole("button", { name: "Open" });

  expect(content().getBoundingClientRect().top).toBeGreaterThan(
    trigger.getBoundingClientRect().top,
  );
  expect(content().style.transformOrigin).toBe("left top");
});

test("flips above the trigger near the bottom edge and moves the origin with it", async () => {
  renderAt(`${window.innerHeight - 60}px`);

  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  const trigger = screen.getByRole("button", { name: "Open" });
  const box = content().getBoundingClientRect();

  expect(box.bottom).toBeLessThanOrEqual(trigger.getBoundingClientRect().top + 1);
  expect(content().style.transformOrigin).toBe("left bottom");
  expect(box.top).toBeGreaterThanOrEqual(0);
});

test("a controlled popover stays closed while the parent keeps it closed", async () => {
  render(
    <Popover.Root open={false} onOpenChange={() => {}}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content">Body</Popover.Content>
    </Popover.Root>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  await expect.poll(() => content().matches(":popover-open")).toBe(false);
});
