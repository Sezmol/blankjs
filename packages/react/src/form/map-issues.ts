import type { StandardSchemaV1 } from "@standard-schema/spec";

export const mapIssues = (issues: ReadonlyArray<StandardSchemaV1.Issue>) =>
  issues.reduce<Record<string, string>>((acc, issue) => {
    const segment = issue.path?.[0];

    // form-level issue (no path) has no field to attach to
    if (segment === undefined) return acc;

    const key = String(typeof segment === "object" ? segment.key : segment);

    acc[key] ??= issue.message;

    return acc;
  }, {});
