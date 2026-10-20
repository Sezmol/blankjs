# @blankjs/core

## 0.6.0

### Minor Changes

- Several `Field.Description`, `Field.Error` or `FieldArray.Error` parts can live
  side by side. Each one gets its own id, an `id` you pass is kept, and the control
  or group lists all of them in `aria-describedby`.

  **Breaking in `@blankjs/core`:** `FieldContextValue` drops `descriptionId`,
  `errorId`, `hasDescription` and `hasError` in favor of `descriptionIds` and
  `errorIds`, and `registerDescription` and `registerError` take the part's id.

- New `CheckboxGroup.Root` and `CheckboxGroup.Item`: native checkboxes that
  share one `string[]` value. `required` means at least one enabled item is
  checked, Field shows the error and focuses the first item, and Field's
  `validate` receives the checked values joined by commas. Form reset returns
  the group to `defaultValue`.

  Field now exposes `refreshControl` in its context (a new required member of
  `FieldContextValue` in core), and an error that is already shown follows a
  value the parent sets, without waiting for the next user event.

### Patch Changes

- `validate` on `Field.Root` no longer goes stale.

  - A cross-field rule runs again when any other field of the form changes. A
    password confirmation that matched no longer lets the form submit after the
    password itself is edited. An error that is already on screen follows the
    change; a field the user has not reached stays quiet.
  - Every rule of the form runs once more at the start of a submit attempt, before
    the browser checks validity, so a value set from code without events is
    caught too.
  - A new `validate` applies on the next render, without waiting for input.
  - Removing `validate` clears the error it had set. On a field that never had
    `validate`, a message you set yourself with `setCustomValidity` is left
    alone; while `validate` is set, it owns the field's custom validity.

## 0.5.0

### Minor Changes

- PinInput.

  PinInput takes a verification code one character per cell. Each cell is a
  real input, so the browser handles the caret and the mobile keyboard, and the
  form receives the whole code as one value under your `name`.

  ```tsx
  <Field.Root required>
    <Field.Label>Code</Field.Label>
    <PinInput name="code" length={6} groups={[3, 3]} onComplete={verify} />
    <Field.Error />
  </Field.Root>
  ```

  A hidden input holds the code with a `pattern` made from `length` and `type`.
  A half-typed code blocks submit like a malformed email, and `Field.Error`
  shows the message. A paste of `123-456` or an SMS autofill spreads across the
  cells. Cells fill from the left, so `value` stays a plain string with no gaps.
  `type="alphanumeric"` accepts letters too, and `mask` hides what the user
  types.

  `usePinInput` in `@blankjs/core` runs the same logic without markup: you get
  props for each cell and render the rest yourself. `@blankjs/react` re-exports
  it.

### Patch Changes

- `useFieldRoot` validates a named radio as its whole group: it takes the value
  of the checked radio, or an empty string, and sets the message on every radio
  in the group. An unchecked checkbox validates as `""`, as in FormData,
  instead of `"on"`.

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
