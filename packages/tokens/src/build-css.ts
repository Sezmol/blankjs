import fs from "node:fs";
import path from "node:path";
import { TOKENS } from "./tokens.ts";

const STRIP_SEGMENTS = new Set(["palette", "semantic"]);
const PREFIX = "bk";
const OUTPUT_PATH = path.join(process.cwd(), "dist", "tokens.css");

const toKebab = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const getVariableName = (segments: string[]): string => {
  const filtered = segments.filter((s) => !STRIP_SEGMENTS.has(s));

  const kebab = filtered.map(toKebab).join("-");

  return `--${PREFIX}-${kebab}`;
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
    } else {
      lines.push(
        `  ${getVariableName(nextPath)}: ${formatTokenValue(String(value))};`,
      );
    }
  }

  return lines;
};

const cssLines = generateLines(TOKENS);
const fileContent = [":root {", ...cssLines, "}", ""].join("\n");

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, fileContent, "utf-8");

console.log(`tokens.css written to ${OUTPUT_PATH}`);
