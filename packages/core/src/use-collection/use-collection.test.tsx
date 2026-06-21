import { useEffect, useRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useCollection } from "./use-collection";

type RegisterFn = (node: HTMLElement, value: string) => () => void;

const Item = ({ value, register }: { value: string; register: RegisterFn }) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    return register(node, value);
  }, [register, value]);

  return <li ref={ref}>{value}</li>;
};

const Harness = ({
  values,
  onRead,
}: {
  values: string[];
  onRead: (order: string[]) => void;
}) => {
  const { registerItem, getItems } = useCollection<string>();

  return (
    <ul>
      {values.map((value) => (
        <Item key={value} value={value} register={registerItem} />
      ))}

      <button onClick={() => onRead(getItems().map((item) => item.value))}>
        read
      </button>
    </ul>
  );
};

test("returns a single registered item", () => {
  const onRead = vi.fn();

  render(<Harness values={["a"]} onRead={onRead} />);

  fireEvent.click(screen.getByRole("button", { name: "read" }));

  expect(onRead).toHaveBeenLastCalledWith(["a"]);
});

test("returns items in DOM order", () => {
  const onRead = vi.fn();

  render(<Harness values={["a", "b", "c"]} onRead={onRead} />);

  fireEvent.click(screen.getByRole("button", { name: "read" }));

  expect(onRead).toHaveBeenLastCalledWith(["a", "b", "c"]);
});

test("places an item inserted after mount in its DOM position, not last", () => {
  const onRead = vi.fn();
  const { rerender } = render(<Harness values={["a", "c"]} onRead={onRead} />);

  rerender(<Harness values={["a", "b", "c"]} onRead={onRead} />);

  fireEvent.click(screen.getByRole("button", { name: "read" }));

  expect(onRead).toHaveBeenLastCalledWith(["a", "b", "c"]);
});

test("drops an item from the list after it unmounts", () => {
  const onRead = vi.fn();
  const { rerender } = render(
    <Harness values={["a", "b", "c"]} onRead={onRead} />,
  );

  rerender(<Harness values={["a", "c"]} onRead={onRead} />);

  fireEvent.click(screen.getByRole("button", { name: "read" }));

  expect(onRead).toHaveBeenLastCalledWith(["a", "c"]);
});
