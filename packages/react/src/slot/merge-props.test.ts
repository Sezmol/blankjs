import { mergeProps } from "./merge-props";

test("child overrides slot for plain props", () => {
  const merged = mergeProps({ id: "slot" }, { id: "child" });

  expect(merged.id).toBe("child");
});

test("calls both handlers when present on slot and child", () => {
  const slotClick = vi.fn();
  const childClick = vi.fn();

  const merged = mergeProps({ onClick: slotClick }, { onClick: childClick });
  (merged.onClick as (e: unknown) => void)({});

  expect(slotClick).toHaveBeenCalledTimes(1);
  expect(childClick).toHaveBeenCalledTimes(1);
});

test("calls handlers in child-then-slot order", () => {
  const order: string[] = [];
  const merged = mergeProps(
    { onClick: () => order.push("slot") },
    { onClick: () => order.push("child") },
  );
  (merged.onClick as (e: unknown) => void)({});

  expect(order).toEqual(["child", "slot"]);
});

test("keeps the child handler when slot has none", () => {
  const childClick = vi.fn();
  const merged = mergeProps({}, { onClick: childClick });
  (merged.onClick as (e: unknown) => void)({});

  expect(childClick).toHaveBeenCalledTimes(1);
});

test("keeps the slot handler when child has none", () => {
  const slotClick = vi.fn();
  const merged = mergeProps({ onClick: slotClick }, {});
  (merged.onClick as (e: unknown) => void)({});

  expect(slotClick).toHaveBeenCalledTimes(1);
});

test("keeps the slot handler when child passes undefined", () => {
  const slotClick = vi.fn();
  const merged = mergeProps({ onClick: slotClick }, { onClick: undefined });
  (merged.onClick as (e: unknown) => void)({});

  expect(slotClick).toHaveBeenCalledTimes(1);
});

test("keeps the slot value when child passes undefined for a plain prop", () => {
  const merged = mergeProps({ id: "slot" }, { id: undefined });

  expect(merged.id).toBe("slot");
});

test("joins className from both sides", () => {
  const merged = mergeProps(
    { className: "bk-trigger" },
    { className: "custom" },
  );

  expect(merged.className).toBe("bk-trigger custom");
});

test("merges style with child winning per property", () => {
  const merged = mergeProps(
    { style: { color: "red", margin: 0 } },
    { style: { color: "blue" } },
  );

  expect(merged.style).toEqual({ color: "blue", margin: 0 });
});
