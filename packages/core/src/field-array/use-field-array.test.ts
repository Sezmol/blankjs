import { act, renderHook } from "@testing-library/react";
import { useFieldArray } from "./use-field-array";

interface User {
  email: string;
}

const setup = (options?: Partial<Parameters<typeof useFieldArray<User>>[0]>) =>
  renderHook(() => useFieldArray<User>({ name: "users", ...options }));

test("starts with one empty row", () => {
  const { result } = setup();

  expect(result.current.rows).toHaveLength(1);
  expect(result.current.rows[0]!.item).toBeUndefined();
});

test("seeds a row per default item and hands each one back", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }, { email: "b" }] });

  expect(result.current.rows.map((row) => row.item?.email)).toEqual(["a", "b"]);
});

test("honours an empty defaultItems instead of forcing a row", () => {
  const { result } = setup({ defaultItems: [] });

  expect(result.current.rows).toHaveLength(0);
});

test("pads the seed up to minItems", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }], minItems: 3 });

  expect(result.current.rows).toHaveLength(3);
});

test("builds names from the array name and the row position", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }, { email: "b" }] });

  expect(result.current.rows[1]!.name("email")).toBe("users[1].email");
  expect(result.current.rows[1]!.name()).toBe("users[1]");
});

test("numbers positions from one", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }, { email: "b" }] });

  expect(result.current.rows.map((row) => row.position)).toEqual([1, 2]);
});

test("appends an empty row", () => {
  const { result } = setup();

  act(() => result.current.append());

  expect(result.current.rows).toHaveLength(2);
  expect(result.current.rows[1]!.item).toBeUndefined();
});

test("keeps keys stable and unique across appends and removals", () => {
  const { result } = setup();

  act(() => result.current.append());
  act(() => result.current.append());

  const keys = result.current.rows.map((row) => row.key);

  expect(new Set(keys).size).toBe(3);

  act(() => result.current.remove(keys[1]!));

  expect(result.current.rows.map((row) => row.key)).toEqual([
    keys[0],
    keys[2],
  ]);
});

test("renumbers names after a removal but leaves keys alone", () => {
  const { result } = setup({
    defaultItems: [{ email: "a" }, { email: "b" }, { email: "c" }],
  });

  const survivor = result.current.rows[2]!.key;

  act(() => result.current.remove(result.current.rows[0]!.key));

  const last = result.current.rows[1]!;

  expect(last.key).toBe(survivor);
  expect(last.name("email")).toBe("users[1].email");
  expect(last.item?.email).toBe("c");
});

test("stops removing at minItems", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }], minItems: 1 });

  expect(result.current.canRemove).toBe(false);

  act(() => result.current.remove(result.current.rows[0]!.key));

  expect(result.current.rows).toHaveLength(1);
});

test("stops appending at maxItems", () => {
  const { result } = setup({ maxItems: 2 });

  act(() => result.current.append());

  expect(result.current.canAppend).toBe(false);

  act(() => result.current.append());

  expect(result.current.rows).toHaveLength(2);
});

test("inserts at a 1-based position", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }, { email: "b" }] });

  act(() => result.current.insert(2));

  expect(result.current.rows.map((row) => row.item?.email)).toEqual([
    "a",
    undefined,
    "b",
  ]);
});

test("moves a row by key and clamps out-of-range positions", () => {
  const { result } = setup({
    defaultItems: [{ email: "a" }, { email: "b" }, { email: "c" }],
  });

  act(() => result.current.move(result.current.rows[0]!.key, 3));

  expect(result.current.rows.map((row) => row.item?.email)).toEqual([
    "b",
    "c",
    "a",
  ]);

  act(() => result.current.move(result.current.rows[2]!.key, 99));

  expect(result.current.rows.map((row) => row.item?.email)).toEqual([
    "b",
    "c",
    "a",
  ]);
});

test("reset restores the seeded rows", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }] });

  act(() => result.current.append());
  act(() => result.current.remove(result.current.rows[0]!.key));
  act(() => result.current.reset());

  expect(result.current.rows.map((row) => row.item?.email)).toEqual(["a"]);
});

test("keys never look like positions", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }, { email: "b" }] });

  act(() => result.current.append());

  for (const row of result.current.rows) {
    expect(row.key).not.toBe(String(row.position));
    expect(row.key).not.toBe(String(row.position - 1));
  }
});

test("types: name narrows to the keys of the row", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }] });
  const row = result.current.rows[0]!;

  expect(row.name("email")).toBe("users[0].email");

  // @ts-expect-error "emial" is not a field of the row
  expect(row.name("emial")).toBe("users[0].emial");
});

test("types: name stays open when there is nothing to infer from", () => {
  const { result } = renderHook(() => useFieldArray({ name: "tags" }));

  expect(result.current.rows[0]!.name("whatever")).toBe("tags[0].whatever");
});

test("ignores a removal for an unknown key", () => {
  const { result } = setup({ defaultItems: [{ email: "a" }, { email: "b" }] });

  act(() => result.current.remove("nope"));

  expect(result.current.rows).toHaveLength(2);
});
