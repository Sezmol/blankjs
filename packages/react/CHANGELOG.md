# @blankjs/react

## 0.4.0

### Minor Changes

- Field arrays.

  `FieldArray` renders a repeating group of fields — guests, line items, phone numbers. Rows are React state, values stay in the DOM, and each row names its inputs `guests[0].email`.

  ```tsx
  <FieldArray name="guests" defaultItems={invited} minItems={1}>
    {({ rows }) => (
      <>
        {rows.map((row) => (
          <div key={row.key}>
            <TextInput
              name={row.name("email")}
              defaultValue={row.item?.email}
            />
            <FieldArray.Remove row={row}>Remove</FieldArray.Remove>
          </div>
        ))}
        <FieldArray.Add>Add guest</FieldArray.Add>
        <FieldArray.Error />
      </>
    )}
  </FieldArray>
  ```

  `Add` and `Remove` carry the behaviour: the list operation, the disabled state from `minItems`/`maxItems`, and the focus move that otherwise drops focus on `<body>` when a row disappears. `row.name()` is narrowed to the row's own fields, so a typo is a type error rather than a name that quietly does not match. `useFieldArray` in `@blankjs/core` is the same logic without the markup, re-exported from `@blankjs/react`.

  **`serialize` now understands paths.** A name written as `address.city` or `guests[0].email` comes back nested instead of as a flat key:

  ```ts
  serialize(formData); // { guests: [{ email: "…" }] }
  ```

  A name that only looks like a path, such as `price[USD]`, is left whole, and a segment named `__proto__`, `constructor` or `prototype` drops the entry instead of reaching the prototype chain.

  **Schema issues carry their full path.** An issue on `["guests", 1, "email"]` now lands on the field named `guests[1].email`. Previously only the first segment was used, so any nested issue was routed to a field named after the root — usually one that did not exist. If you relied on that, move the message to the root field explicitly.

  Also in this release: a form `reset` clears schema errors from an earlier submit, and Select, Combobox and MultiSelect keep their form proxy inputs hidden when `styles.css` is not imported.

### Patch Changes

- Updated dependencies
  - @blankjs/core@0.4.0
