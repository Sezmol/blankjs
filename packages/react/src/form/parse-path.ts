export type PathSegment = string | number;

// writing these would reach the prototype chain instead of the object; form
// names usually come from your own JSX, but not when a CMS builds them
const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** null when the key is not a path at all (`email`, `price[USD]`, `users[0`) */
const tokenize = (key: string): PathSegment[] | null => {
  const segments: PathSegment[] = [];

  let buffer = "";
  let index = 0;

  const flush = () => {
    if (!buffer) return;

    segments.push(buffer);
    buffer = "";
  };

  while (index < key.length) {
    const char = key[index];

    if (char === ".") {
      flush();
      index++;
      continue;
    }

    if (char === "[") {
      const end = key.indexOf("]", index);

      if (end === -1) return null;

      const inner = key.slice(index + 1, end);

      if (!/^\d+$/.test(inner)) return null;

      flush();
      segments.push(Number(inner));
      index = end + 1;
      continue;
    }

    buffer += char;
    index++;
  }

  flush();

  return segments.length > 1 ? segments : null;
};

/**
 * `users[0].email` -> `["users", 0, "email"]`
 *
 * A name we do not own comes back whole as a single segment, so keys that
 * merely look like paths keep working. An unsafe segment returns null and
 * the entry is dropped.
 */
export const parsePath = (key: string): PathSegment[] | null => {
  if (UNSAFE_KEYS.has(key)) return null;

  const segments = tokenize(key);

  if (!segments) return [key];

  const unsafe = segments.some(
    (segment) => typeof segment === "string" && UNSAFE_KEYS.has(segment),
  );

  return unsafe ? null : segments;
};

/** true for `users`, `users[0]` and `users[0].email` when prefix is `users` */
export const isUnderPath = (name: string, prefix: string) =>
  name === prefix ||
  name.startsWith(`${prefix}[`) ||
  name.startsWith(`${prefix}.`);

/** `["users", 0, "email"]` -> `users[0].email` — the inverse of parsePath */
export const formatPath = (segments: readonly PathSegment[]) =>
  segments.reduce<string>((acc, segment) => {
    if (typeof segment === "number") return `${acc}[${segment}]`;

    return acc ? `${acc}.${segment}` : segment;
  }, "");
