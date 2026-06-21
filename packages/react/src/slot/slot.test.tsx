import { render, screen, fireEvent } from "@testing-library/react";
import { Slot } from "./slot";

test("merges className from slot and child onto the cloned element", () => {
  render(
    <Slot className="bk-trigger">
      <button className="custom">x</button>
    </Slot>,
  );

  expect(screen.getByRole("button")).toHaveClass("bk-trigger", "custom");
});

test("lets the child override a plain prop", () => {
  render(
    <Slot id="slot">
      <button id="child">x</button>
    </Slot>,
  );

  expect(screen.getByRole("button")).toHaveAttribute("id", "child");
});

test("calls both the slot and child onClick on click", () => {
  const slotClick = vi.fn();
  const childClick = vi.fn();

  render(
    <Slot onClick={slotClick}>
      <button onClick={childClick}>x</button>
    </Slot>,
  );
  fireEvent.click(screen.getByRole("button"));

  expect(slotClick).toHaveBeenCalledTimes(1);
  expect(childClick).toHaveBeenCalledTimes(1);
});

test("composes both the slot ref and the child ref onto the node", () => {
  const ourRef = { current: null as HTMLButtonElement | null };
  const userRef = { current: null as HTMLButtonElement | null };

  render(
    <Slot ref={ourRef}>
      <button ref={userRef}>x</button>
    </Slot>,
  );
  const button = screen.getByRole("button");

  expect(ourRef.current).toBe(button);
  expect(userRef.current).toBe(button);
});

test("renders a single child", () => {
  render(
    <Slot>
      <button>x</button>
    </Slot>,
  );

  expect(screen.getByRole("button")).toBeInTheDocument();
});

test("throws when given more than one child", () => {
  expect(() =>
    render(
      // @ts-expect-error - intentionally violating the contract of one child
      <Slot>
        <button>a</button>
        <button>b</button>
      </Slot>,
    ),
  ).toThrow();
});
