import { serialize } from "./serialize";

const formData = (entries: [string, FormDataEntryValue][]) => {
  const data = new FormData();

  for (const [key, value] of entries) data.append(key, value);

  return data;
};

test("maps single keys to values and repeated keys to arrays", () => {
  const data = formData([
    ["name", "Ann"],
    ["visited", "AU"],
    ["visited", "AT"],
  ]);

  expect(serialize(data)).toEqual({ name: "Ann", visited: ["AU", "AT"] });
});

test("keeps File values intact", () => {
  const file = new File(["hi"], "hi.txt", { type: "text/plain" });

  expect(serialize(formData([["doc", file]])).doc).toBe(file);
});

test("returns an empty object for an empty form", () => {
  expect(serialize(new FormData())).toEqual({});
});

test("builds an array of objects from indexed names", () => {
  const data = formData([
    ["users[0].email", "a@x.dev"],
    ["users[0].role", "admin"],
    ["users[1].email", "b@x.dev"],
    ["users[1].role", "member"],
  ]);

  expect(serialize(data)).toEqual({
    users: [
      { email: "a@x.dev", role: "admin" },
      { email: "b@x.dev", role: "member" },
    ],
  });
});

test("builds an array of scalars from a bare index", () => {
  const data = formData([
    ["tags[0]", "react"],
    ["tags[1]", "forms"],
  ]);

  expect(serialize(data)).toEqual({ tags: ["react", "forms"] });
});

test("builds nested objects from dotted names", () => {
  const data = formData([
    ["address.city", "Berlin"],
    ["address.zip", "10115"],
  ]);

  expect(serialize(data)).toEqual({ address: { city: "Berlin", zip: "10115" } });
});

test("nests an array inside an array item", () => {
  const data = formData([
    ["users[0].phones[0]", "111"],
    ["users[0].phones[1]", "222"],
  ]);

  expect(serialize(data)).toEqual({ users: [{ phones: ["111", "222"] }] });
});

test("keeps repeated indexed names as an array on the leaf", () => {
  const data = formData([
    ["users[0].tags", "a"],
    ["users[0].tags", "b"],
  ]);

  expect(serialize(data)).toEqual({ users: [{ tags: ["a", "b"] }] });
});

test("closes the gap left by a skipped index", () => {
  const data = formData([
    ["users[0].email", "a@x.dev"],
    ["users[2].email", "c@x.dev"],
  ]);

  expect(serialize(data)).toEqual({
    users: [{ email: "a@x.dev" }, { email: "c@x.dev" }],
  });
});

test("lets the structure win over a bare name, whichever comes first", () => {
  const structureLast = formData([
    ["users", ""],
    ["users[0].email", "a@x.dev"],
  ]);

  const structureFirst = formData([
    ["users[0].email", "a@x.dev"],
    ["users", ""],
  ]);

  const expected = { users: [{ email: "a@x.dev" }] };

  expect(serialize(structureLast)).toEqual(expected);
  expect(serialize(structureFirst)).toEqual(expected);
});

test("lets the structure win inside a row too", () => {
  const data = formData([
    ["users[0].email", "a@x.dev"],
    ["users[0]", ""],
  ]);

  expect(serialize(data)).toEqual({ users: [{ email: "a@x.dev" }] });
});

test("leaves a non-numeric bracket as a flat key", () => {
  expect(serialize(formData([["price[USD]", "10"]]))).toEqual({
    "price[USD]": "10",
  });
});

test("leaves an unclosed bracket as a flat key", () => {
  expect(serialize(formData([["users[0", "x"]]))).toEqual({ "users[0": "x" });
});

test("leaves an empty bracket as a flat key", () => {
  expect(serialize(formData([["tags[]", "react"]]))).toEqual({
    "tags[]": "react",
  });
});

test("does not reach the prototype through a crafted name", () => {
  const data = formData([
    ["__proto__.polluted", "yes"],
    ["a.constructor.prototype.polluted", "yes"],
    ["safe", "ok"],
  ]);

  const result = serialize(data);

  expect(result).toEqual({ safe: "ok" });
  expect(({} as Record<string, unknown>).polluted).toBeUndefined();
});
