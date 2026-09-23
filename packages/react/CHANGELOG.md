# @blankjs/react

## 0.5.0

### Minor Changes

- **Breaking:** the empty value of `Select` and `Combobox` is `null` now.

  `value` and `defaultValue` take `string | null`, and `onValueChange` receives
  `string | null`. `Clear` reports `null`, and so does a form reset when there
  is no `defaultValue`. `undefined` still means uncontrolled.

  Before, you could not clear a controlled Select: with `useState<string>()`
  your state went back to `undefined`, the Select took that as uncontrolled and
  kept showing the old value.

  To migrate:

  ```tsx
  // before
  const [country, setCountry] = useState<string>();

  // after
  const [country, setCountry] = useState<string | null>(null);
  ```

  - Type your state and handlers as `string | null`. TypeScript reports an
    error on every handler that still expects `string | undefined`.
  - Replace `value === undefined` checks with `value === null`.
  - To clear a controlled Select or Combobox from code, set `null`. Setting
    `undefined` switches it to uncontrolled.

  MultiSelect keeps `[]` as its empty value.

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

- `Form.Error` and the `error` prop on `Form`.

  Some errors belong to no field, like a declined card or shares that must add
  up to 100. Pass them as `error`, or return them from the schema as an issue
  without a `path`, and `Form.Error` shows them.

  ```tsx
  <Form error={declined ? "Card declined" : undefined}>
    <Form.Error />
    ...
  </Form>
  ```

  Before, Form dropped a schema issue without a `path`: the submit failed and
  the user saw nothing.

  `Form.Error` renders `role="alert"` and leaves focus alone. Only the next
  submit or a reset clears the message. Your `error` prop wins over the
  schema's and survives a reset, like `errors`.

- Focus moves to the first invalid field only when the user tries to submit.

  Before, `Form` moved focus on every `invalid` event, so a `checkValidity()`
  call from your code pulled focus away from the user. Now `checkValidity()`
  reveals the errors and leaves focus where it is.

  `Field` now moves focus itself, so a Field inside a plain `<form>` gets this
  too. Before, only `Form` did.

  `requestSubmit()` from your code does not count as a submit attempt: it
  reveals the errors but does not move focus.

- Every component exports its props type from the package root:
  `SelectRootProps`, `DialogContentProps`, `PinInputProps` and so on, one per
  part. You can wrap a component without `ComponentProps<typeof ...>`.

  ```ts
  import type { SelectRootProps } from "@blankjs/react";
  ```

  `Field.Control` has no props type: the name `FieldControlProps` belongs to
  the result of `useFieldControlProps`.

- Motion layer. Every animation uses shared easing, duration and distance
  tokens instead of the browser's default `ease`. Motion turns off under
  `prefers-reduced-motion: reduce` or `data-bk-motion="off"` on any element:
  movement stops, fades keep running.

  Overlays grow out of their trigger instead of their own center. Tooltip gets
  an exit animation. Buttons sink a little when you press them, and the
  checkbox mark pops in and out.

- Form controls get their own border color, `--bk-color-border-control`, with
  at least 3:1 contrast against the field and the page (WCAG 1.4.11). Inputs,
  select triggers, PinInput cells, checkboxes and radios use it. Cards, popups,
  tabs, accordions and the Switch and Slider tracks keep the subtler
  `--bk-color-border`. `--bk-color-border-hover` moved one palette step, so a
  hovered control still stands out from a resting one.

  If you overrode `--bk-color-border` to restyle inputs, override
  `--bk-color-border-control` instead.

  New palette step: `--bk-gray-450`.

### Patch Changes

- Form and field fixes.

  - A `validate` on `Field.Root` around a Combobox or RadioGroup no longer keeps
    the form invalid after the user picks a valid value.
  - `validate` on a Field around a Select or MultiSelect checks the initial
    value too.
  - `validationMode="blur"` shows errors on Select, MultiSelect and Combobox.
    Before, it showed nothing on them.
  - `required` works on RadioGroup: set it on `RadioGroup.Root` or on the Field
    around it, and the form will not submit until the user checks a radio.
  - `validate` on a Field around an unchecked Checkbox or Switch receives `""`,
    as FormData would, instead of `"on"`.
  - Select, MultiSelect and Combobox inside a disabled Field act like a
    disabled input: they leave FormData and skip validation. They also hide
    their Clear button.
  - The FormData that `onSubmit` receives includes the `name` and `value` of
    the submit button the user pressed, as a native submit does.
  - Calling `preventDefault()` in `onReset` cancels the reset for Checkbox,
    Switch, RadioGroup, Select, MultiSelect, Combobox, FieldArray rows, field
    errors and schema errors. Before, they reset anyway.
  - A `<form>` you render through a portal inside `Form` submits on its own.
    Before, its submit reached the outer `Form`, which failed with
    `NotFoundError`.
  - Server `errors` move focus to a MultiSelect as they do for any other field.
    If the browser focuses the hidden input of a Select, MultiSelect or
    Combobox right after mount, focus goes on to the trigger or text input.
  - A schema error the user already fixed no longer shows up again during the
    next async submit.

- Component fixes.

  - Select, MultiSelect and Combobox inside a modal Dialog open above the
    backdrop and respond to clicks. Their popup renders into the nearest
    `<dialog>` unless you pass a `container`.
  - Picking an option with the mouse keeps focus on the Select or MultiSelect
    trigger. Before, focus fell to `<body>`.
  - Combobox commits an item on `click` instead of `pointerdown`, so scrolling
    the list with a finger does not pick the item under it.
  - Select and MultiSelect triggers respect `preventDefault()` in your
    `onClick` and `onKeyDown`, like every other part.
  - A controlled Popover, Menu or Tooltip with `open={false}` stays closed when
    the user clicks its trigger.
  - Dialog stays open when the user starts a text selection inside it and
    releases the mouse over the backdrop. If you close the `<dialog>` outside
    React, with a `method="dialog"` form or `dialog.close()`, Dialog updates
    its open state and the trigger opens it again.
  - NumberField with `step="any"` no longer throws `InvalidStateError` from its
    buttons: they step by 1 and keep the decimals. `readOnly` disables the
    buttons.
  - The Tab key reaches Tabs without a `defaultValue`, and a tab value with a
    space no longer breaks `aria-controls` and `aria-labelledby`.

- Opening a Select, Combobox or MultiSelect no longer scrolls the page. Before,
  these components called `scrollIntoView` on the highlighted option before
  positioning the popup, and a control far down the page sent the window back
  to the top. Now only the listbox scrolls, and the selected option is in full
  view when the list opens.

  The listbox height stops at the space left in the viewport, so arrow keys
  never push the highlighted option off screen. The limit comes from
  `--bk-available-height`, which every positioned popup now gets.

- Better contrast in both themes.

  Dark theme: popups, dialogs and tooltips sit one step lighter than inputs,
  and the hover and list highlight colors moved with them. Muted text is
  brighter.

  Light theme: `--bk-color-danger` is one shade darker. That darkens the danger
  button, invalid borders and focus rings, and checked invalid checkboxes,
  radios and switches.

  Field, Form and FieldArray errors use `--bk-color-danger-text`, with at least
  4.5:1 contrast in both themes.

  New palette steps: `--bk-gray-350`, `--bk-gray-650`, `--bk-gray-750`,
  `--bk-red-700`.

- Hover styles apply only on devices that can hover, so a tapped button,
  checkbox or accordion no longer stays tinted on a touch screen.

  Slider draws the unfilled part of its track in the border color, like an
  unchecked Switch. The old dark fill with a thin outline was hard to see in
  the dark theme.

  New token: `--bk-radius-full`.

- `Dialog.Close`, `FieldArray.Add` and `FieldArray.Remove` sink a little when
  you press them, like Button. Reduced motion turns this off.

- Updated dependencies
  - @blankjs/core@0.5.0

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
