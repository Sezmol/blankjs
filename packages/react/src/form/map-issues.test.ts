import type { StandardSchemaV1 } from "@standard-schema/spec";
import { mapIssues } from "./map-issues";

const issue = (
  message: string,
  path?: StandardSchemaV1.Issue["path"],
): StandardSchemaV1.Issue => ({ message, path });

test("keys a flat issue by its field name", () => {
  expect(mapIssues([issue("Too short", ["username"])])).toEqual({
    username: "Too short",
  });
});

test("renders an array path the way the name is written", () => {
  expect(mapIssues([issue("Invalid", ["users", 0, "email"])])).toEqual({
    "users[0].email": "Invalid",
  });
});

test("renders a nested object path with dots", () => {
  expect(mapIssues([issue("Required", ["address", "city"])])).toEqual({
    "address.city": "Required",
  });
});

test("renders an issue on the array itself", () => {
  expect(mapIssues([issue("At least two", ["users"])])).toEqual({
    users: "At least two",
  });
});

test("renders an array of scalars", () => {
  expect(mapIssues([issue("Bad tag", ["tags", 2])])).toEqual({
    "tags[2]": "Bad tag",
  });
});

test("supports object path segments", () => {
  expect(
    mapIssues([issue("Invalid", [{ key: "users" }, { key: 1 }, { key: "email" }])]),
  ).toEqual({ "users[1].email": "Invalid" });
});

test("keeps the first issue per path", () => {
  const issues = [
    issue("First", ["users", 0, "email"]),
    issue("Second", ["users", 0, "email"]),
  ];

  expect(mapIssues(issues)).toEqual({ "users[0].email": "First" });
});

test("ignores issues without a path", () => {
  expect(mapIssues([issue("Form-level"), issue("Also form-level", [])])).toEqual(
    {},
  );
});
