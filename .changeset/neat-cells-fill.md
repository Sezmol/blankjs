---
"@blankjs/core": minor
"@blankjs/react": minor
---

PinInput.

A verification code split into cells. Each cell is a real input, so the
browser handles the caret, the mobile keyboard and text editing, and the form
gets the whole code as one value under your `name`.

```tsx
<Field.Root required>
  <Field.Label>Code</Field.Label>
  <PinInput name="code" length={6} groups={[3, 3]} onComplete={verify} />
  <Field.Error />
</Field.Root>
```

The code rides a hidden input with a `pattern` built from `length` and `type`,
so a half-typed code blocks submit the same way a malformed email does, and
`Field.Error` reports it. Pasting `123-456` or autofilling from an SMS spreads
the characters across the cells. Cells fill from the left, so `value` is
always a plain string. `type="alphanumeric"`, `mask` and `placeholder` cover
the other common kinds of code.

`usePinInput` in `@blankjs/core` is the same logic without markup: it gives
you the props for each cell and leaves the rest to you. It is re-exported from
`@blankjs/react`.
