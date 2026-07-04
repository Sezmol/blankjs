import fs from "node:fs";
import path from "node:path";
import { TOKENS } from "./tokens.ts";

const PREFIX = "bk";
const OUTPUT_PATH = path.join(process.cwd(), "dist", "tokens.css");

const toKebab = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const getVariableName = (segments: string[]): string => {
  const filtered = segments.filter((s) => s !== "palette");

  return `--${PREFIX}-${filtered.map(toKebab).join("-")}`;
};

const validateRef = (refPath: string): string[] => {
  const segments = refPath.split(".");
  let current: unknown = TOKENS;

  for (const segment of segments) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(segment in current)
    ) {
      throw new Error(
        `Broken token reference: "{${refPath}}". Path does not exist.`,
      );
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return segments;
};

const formatTokenValue = (value: string): string => {
  if (value.startsWith("{") && value.endsWith("}")) {
    const segments = validateRef(value.slice(1, -1));

    return `var(${getVariableName(segments)})`;
  }

  return value;
};

const generateLines = (node: object, currentPath: string[] = []): string[] => {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(node)) {
    const nextPath = [...currentPath, key];

    if (typeof value === "object" && value !== null) {
      lines.push(...generateLines(value, nextPath));
      continue;
    }

    lines.push(
      `  ${getVariableName(nextPath)}: ${formatTokenValue(String(value))};`,
    );
  }

  return lines;
};

const collectLeafPaths = (
  node: object,
  currentPath: string[] = [],
): string[] => {
  const result: string[] = [];

  for (const [key, value] of Object.entries(node)) {
    const nextPath = [...currentPath, key];

    if (typeof value === "object" && value !== null) {
      result.push(...collectLeafPaths(value, nextPath));
    } else {
      result.push(nextPath.join("."));
    }
  }

  return result;
};

const validateThemeParity = (dark: object, light: object) => {
  const darkKeys = new Set(collectLeafPaths(dark));
  const lightKeys = new Set(collectLeafPaths(light));

  const missingInLight = [...darkKeys].filter((key) => !lightKeys.has(key));
  const missingInDark = [...lightKeys].filter((key) => !darkKeys.has(key));

  const errors: string[] = [];

  if (missingInLight.length > 0) {
    errors.push(`Missing in light theme: ${missingInLight.join(", ")}`);
  }

  if (missingInDark.length > 0) {
    errors.push(`Missing in dark theme: ${missingInDark.join(", ")}`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

const { palette, themes, ...statics } = TOKENS;

validateThemeParity(themes.dark, themes.light);

const rootLines = [
  ...generateLines(palette, ["palette"]),
  ...generateLines(statics),
  ...generateLines(themes.dark),
];

const lightLines = generateLines(themes.light);

const fileContent = [
  ':root, [data-bk-theme="dark"] {',
  "  color-scheme: dark;",
  ...rootLines,
  "}",
  "",
  '[data-bk-theme="light"] {',
  "  color-scheme: light;",
  ...lightLines,
  "}",
  "",
].join("\n");

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, fileContent, "utf-8");

console.log(`tokens.css written to ${OUTPUT_PATH}`);
