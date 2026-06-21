import { composeRefs } from "./compose-refs";

test("calls a callback ref with the node", () => {
  const cb = vi.fn();
  const node = document.createElement("div");

  composeRefs(cb)(node);

  expect(cb).toHaveBeenCalledWith(node);
});

test("writes the node to an object ref's current", () => {
  const ref = { current: null as HTMLElement | null };
  const node = document.createElement("div");

  composeRefs(ref)(node);

  expect(ref.current).toBe(node);
});

test("feeds the same node to a callback ref and an object ref together", () => {
  const cb = vi.fn();
  const ref = { current: null as HTMLElement | null };
  const node = document.createElement("div");

  composeRefs(cb, ref)(node);

  expect(cb).toHaveBeenCalledWith(node);
  expect(ref.current).toBe(node);
});

test("ignores undefined refs without throwing", () => {
  const cb = vi.fn();
  const node = document.createElement("div");

  composeRefs(cb, undefined)(node);

  expect(cb).toHaveBeenCalledWith(node);
});

test("propagates null to all refs on unmount", () => {
  const cb = vi.fn();
  const ref = { current: document.createElement("div") as HTMLElement | null };

  composeRefs(cb, ref)(null);

  expect(cb).toHaveBeenCalledWith(null);
  expect(ref.current).toBeNull();
});
