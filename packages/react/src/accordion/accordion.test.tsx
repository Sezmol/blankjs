import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./index";

const fireToggle = (details: HTMLElement, newState: "open" | "closed") => {
  const event = new Event("toggle", { bubbles: false });

  Object.assign(event, {
    newState,
    oldState: newState === "open" ? "closed" : "open",
  });

  fireEvent(details, event);
};

test("renders native details and summary", () => {
  render(
    <Accordion.Root>
      <Accordion.Item data-testid="item">
        <Accordion.Trigger>Question</Accordion.Trigger>
        <Accordion.Content>Answer</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>,
  );

  const item = screen.getByTestId("item");

  expect(item.tagName).toBe("DETAILS");
  expect(screen.getByText("Question").tagName).toBe("SUMMARY");
  expect(item).not.toHaveAttribute("open");
});

test("defaultOpen renders the item open and leaves it uncontrolled", () => {
  const { rerender } = render(
    <Accordion.Root>
      <Accordion.Item data-testid="item" defaultOpen>
        <Accordion.Trigger>Question</Accordion.Trigger>
        <Accordion.Content>Answer</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>,
  );

  const item = screen.getByTestId("item") as HTMLDetailsElement;

  expect(item).toHaveAttribute("open");

  item.open = false;

  rerender(
    <Accordion.Root>
      <Accordion.Item data-testid="item" defaultOpen>
        <Accordion.Trigger>Question</Accordion.Trigger>
        <Accordion.Content>Answer</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>,
  );

  expect(item.open).toBe(false);
});

test("clicking the summary toggles the item", async () => {
  const user = userEvent.setup();

  render(
    <Accordion.Root>
      <Accordion.Item data-testid="item">
        <Accordion.Trigger>Question</Accordion.Trigger>
        <Accordion.Content>Answer</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>,
  );

  await user.click(screen.getByText("Question"));

  expect((screen.getByTestId("item") as HTMLDetailsElement).open).toBe(true);
});

test("exclusive group shares one native name", () => {
  render(
    <Accordion.Root exclusive>
      <Accordion.Item data-testid="a">
        <Accordion.Trigger>A</Accordion.Trigger>
      </Accordion.Item>
      <Accordion.Item data-testid="b">
        <Accordion.Trigger>B</Accordion.Trigger>
      </Accordion.Item>
    </Accordion.Root>,
  );

  const a = screen.getByTestId("a");
  const b = screen.getByTestId("b");

  expect(a.getAttribute("name")).toBeTruthy();
  expect(a.getAttribute("name")).toBe(b.getAttribute("name"));
});

test("non-exclusive items have no name", () => {
  render(
    <Accordion.Root>
      <Accordion.Item data-testid="item">
        <Accordion.Trigger>A</Accordion.Trigger>
      </Accordion.Item>
    </Accordion.Root>,
  );

  expect(screen.getByTestId("item")).not.toHaveAttribute("name");
});

test("onOpenChange notifies from the toggle event", () => {
  const onOpenChange = vi.fn();

  render(
    <Accordion.Root>
      <Accordion.Item data-testid="item" onOpenChange={onOpenChange}>
        <Accordion.Trigger>Question</Accordion.Trigger>
      </Accordion.Item>
    </Accordion.Root>,
  );

  fireToggle(screen.getByTestId("item"), "open");

  expect(onOpenChange).toHaveBeenCalledWith(true);
});

test("vetoed toggle skips onOpenChange", () => {
  const onOpenChange = vi.fn();

  render(
    <Accordion.Root>
      <Accordion.Item
        data-testid="item"
        onOpenChange={onOpenChange}
        onToggle={(e) => e.preventDefault()}
      >
        <Accordion.Trigger>Question</Accordion.Trigger>
      </Accordion.Item>
    </Accordion.Root>,
  );

  fireToggle(screen.getByTestId("item"), "open");

  expect(onOpenChange).not.toHaveBeenCalled();
});

test("controlled item reverts a change the consumer ignored", () => {
  render(
    <Accordion.Root>
      <Accordion.Item data-testid="item" open={false}>
        <Accordion.Trigger>Question</Accordion.Trigger>
      </Accordion.Item>
    </Accordion.Root>,
  );

  const item = screen.getByTestId("item") as HTMLDetailsElement;

  item.open = true;
  fireToggle(item, "open");

  expect(item.open).toBe(false);
});

test("works controlled", () => {
  const Controlled = () => {
    const [open, setOpen] = useState(false);

    return (
      <Accordion.Root>
        <Accordion.Item data-testid="item" open={open} onOpenChange={setOpen}>
          <Accordion.Trigger>Question</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>
    );
  };

  render(<Controlled />);

  const item = screen.getByTestId("item") as HTMLDetailsElement;

  item.open = true;
  fireToggle(item, "open");

  expect(item.open).toBe(true);
  expect(item).toHaveAttribute("open");
});
