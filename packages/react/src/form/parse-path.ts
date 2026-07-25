export type PathSegment = string | number;

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

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

export const parsePath = (key: string): PathSegment[] | null => {
  if (UNSAFE_KEYS.has(key)) return null;

  const segments = tokenize(key);

  if (!segments) return [key];

  const unsafe = segments.some(
    (segment) => typeof segment === "string" && UNSAFE_KEYS.has(segment),
  );

  return unsafe ? null : segments;
};

export const isUnderPath = (name: string, prefix: string) =>
  name === prefix ||
  name.startsWith(`${prefix}[`) ||
  name.startsWith(`${prefix}.`);

export const formatPath = (segments: readonly PathSegment[]) =>
  segments.reduce<string>((acc, segment) => {
    if (typeof segment === "number") return `${acc}[${segment}]`;

    return acc ? `${acc}.${segment}` : segment;
  }, "");
