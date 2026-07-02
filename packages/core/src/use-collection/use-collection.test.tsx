import { useEffect, useId, useRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useCollection, type RegisterItemFn } from "./use-collection";

const Item = ({
  value,
  textValue,
  register,
}: {
  value: string;
  textValue?: string;
  register: RegisterItemFn<string>;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const id = useId();

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    return register({
      node,
      value,
      label: textValue ?? node.textContent ?? "",
      id,
    });
  }, [register, textValue, value, id]);

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

const LabelHarness = ({
  items,
  onRead,
}: {
  items: { value: string; textValue?: string }[];
  onRead: (pairs: string[]) => void;
}) => {
  const { registerItem, getItems } = useCollection<string>();

  return (
    <ul>
      {items.map((item) => (
        <Item
          key={item.value}
          value={item.value}
          textValue={item.textValue}
          register={registerItem}
        />
      ))}

      <button
        onClick={() =>
          onRead(getItems().map((item) => `${item.value}:${item.label}`))
        }
      >
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

test("stores the provided textValue as label", () => {
  const onRead = vi.fn();

  render(
    <LabelHarness
      items={[{ value: "us", textValue: "United States" }]}
      onRead={onRead}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "read" }));

  expect(onRead).toHaveBeenLastCalledWith(["us:United States"]);
});

test("falls back to textContent as label when textValue is absent", () => {
  const onRead = vi.fn();

  render(<LabelHarness items={[{ value: "de" }]} onRead={onRead} />);

  fireEvent.click(screen.getByRole("button", { name: "read" }));

  expect(onRead).toHaveBeenLastCalledWith(["de:de"]);
});
