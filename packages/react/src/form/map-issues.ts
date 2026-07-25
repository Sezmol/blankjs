import type { StandardSchemaV1 } from "@standard-schema/spec";
import { formatPath, type PathSegment } from "./parse-path";

const toSegment = (
  segment: PropertyKey | StandardSchemaV1.PathSegment,
): PathSegment => {
  const key = typeof segment === "object" ? segment.key : segment;

  return typeof key === "number" ? key : String(key);
};

export const mapIssues = (issues: ReadonlyArray<StandardSchemaV1.Issue>) =>
  issues.reduce<Record<string, string>>((acc, issue) => {
    // form-level issue (no path) has no field to attach to
    if (!issue.path?.length) return acc;

    const name = formatPath(issue.path.map(toSegment));

    acc[name] ??= issue.message;

    return acc;
  }, {});
