import { parsePath, type PathSegment } from "./parse-path";

type Value = FormDataEntryValue | FormDataEntryValue[];
type Node = Record<string, unknown> | unknown[];

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  Object.getPrototypeOf(value) === Object.prototype;

const readKey = (node: Node, key: PathSegment): unknown =>
  Array.isArray(node) ? node[Number(key)] : node[String(key)];

const writeKey = (node: Node, key: PathSegment, value: unknown) => {
  if (Array.isArray(node)) node[Number(key)] = value;
  else node[String(key)] = value;
};

const setIn = (root: Node, path: PathSegment[], value: Value) => {
  let node = root;

  for (let index = 0; index < path.length - 1; index++) {
    const key = path[index]!;
    const current = readKey(node, key);

    if (Array.isArray(current) || isPlainObject(current)) {
      node = current;
      continue;
    }

    // the next segment decides the container: a number needs an array
    const container: Node = typeof path[index + 1] === "number" ? [] : {};

    writeKey(node, key, container);
    node = container;
  }

  const leaf = path.at(-1)!;

  // a form carrying both `users` and `users[0].email` is a naming conflict;
  // resolve it the same way whichever comes first in the DOM, by letting the
  // structure win over the lone value
  if (isPlainObject(readKey(node, leaf)) || Array.isArray(readKey(node, leaf))) {
    return;
  }

  writeKey(node, leaf, value);
};

// a conditionally rendered row leaves users[0] and users[2] behind, which
// builds an array with a hole; schemas see undefined there and fail
const compact = (node: unknown): unknown => {
  if (Array.isArray(node)) return node.filter(() => true).map(compact);
  if (!isPlainObject(node)) return node;

  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => [key, compact(value)]),
  );
};

export const serialize = (data: FormData) => {
  const result: Record<string, unknown> = {};

  for (const key of new Set(data.keys())) {
    const path = parsePath(key);

    if (!path) continue;

    const values = data.getAll(key);

    setIn(result, path, values.length > 1 ? values : (values[0] ?? ""));
  }

  return compact(result) as Record<string, unknown>;
};
