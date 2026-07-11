# blankjs

[![npm](https://img.shields.io/npm/v/@blankjs/react?label=%40blankjs%2Freact)](https://www.npmjs.com/package/@blankjs/react)
[![npm](https://img.shields.io/npm/v/@blankjs/core?label=%40blankjs%2Fcore)](https://www.npmjs.com/package/@blankjs/core)

Form-first React components built on native form elements.

```bash
npm install @blankjs/react
```

blankjs is a component library that treats the browser as an ally instead of an obstacle. Where other libraries rebuild form controls from `<div>`s and ARIA, blankjs styles the real elements and lets the platform do the work.

## Packages

| Package | Contents |
|---------|----------|
| `@blankjs/react` | Styled, accessible components |
| `@blankjs/core` | Headless hooks: `useControllableState`, `useFieldControlProps`, `useCollection` |

Design tokens live in a private `@blankjs/tokens` workspace package and ship inlined in `styles.css` as CSS variables.

## Philosophy

### Native first

Most libraries render a `<button role="checkbox">`, manage its state in JavaScript, and mirror the value into a hidden input for forms. blankjs renders a real `<input type="checkbox">` and strips its default look with `appearance: none`.

The browser then handles, with zero JavaScript on our side:

- **FormData serialization**: the value is in `new FormData(form)` because the input is real
- **Form reset**: `<button type="reset">` restores every control
- **Label activation**: clicking a `<label>` toggles the control
- **Radio semantics**: arrow-key navigation and roving tabindex come from the platform
- **Tab order**: one tab stop per radio group, as users expect

Checkbox, Switch, and RadioGroup are styled native inputs. Switch is a checkbox with `role="switch"`. No state mirroring, no synthetic focus management, no drift between what you see and what the form submits.

### Form first, without a form library

Every component participates in a plain `<form>`:

```tsx
<form onSubmit={handleSubmit}>
  <Field.Root>
    <Field.Label>Country</Field.Label>
    <Select.Root name="country" defaultValue="AU">
      <Select.Trigger>
        <Select.Value placeholder="Select" />
      </Select.Trigger>
      <Select.Clear />
      <Select.Content>
        <Select.Item value="AU">Australia</Select.Item>
        <Select.Item value="AT">Austria</Select.Item>
      </Select.Content>
    </Select.Root>
  </Field.Root>

  <MultiSelect.Root name="visited" defaultValue={["AU"]}>
    {/* ... */}
  </MultiSelect.Root>

  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
```

```ts
const data = new FormData(form);
data.get("country"); // "AU"
data.getAll("visited"); // ["AU"]
```

How it works:

- Composite widgets (Select, Combobox, MultiSelect) render hidden inputs bound to `name`
- MultiSelect submits one entry per selected value, read with `formData.getAll(name)`
- Every component listens for the form's `reset` event and restores its `defaultValue`, including controlled inputs the browser resets without firing a change event
- Disabled controls drop out of FormData, matching native behavior

No form library required. React Hook Form and friends still work if you want them, but they stop being a prerequisite.

### Validation through the browser

Validation rides on the Constraint Validation API instead of a schema library:

```tsx
<Form onSubmit={(data) => send(serialize(data))} errors={serverErrors}>
  <Field.Root
    name="username"
    required
    validationMode="change"
    validate={(value) => (value.includes(" ") ? "No spaces allowed" : null)}
  >
    <Field.Label>Username</Field.Label>
    <TextInput name="username" />
    <Field.Error match="valueMissing">Enter a username</Field.Error>
    <Field.Error />
  </Field.Root>
</Form>
```

- HTML constraints (`required`, `pattern`, `minLength`, `type="email"`) report through `ValidityState`; `Field.Error match` filters by flag, and without children it renders the browser's localized message
- Errors reveal on submit by default; `validationMode="blur"` or `"change"` reveals them earlier
- `validate` feeds `setCustomValidity`, so a failing custom rule blocks submit exactly like a native constraint
- Composite widgets participate: `required` on an empty Select blocks submit and moves focus to the trigger
- `<Form errors={{ username: "Taken" }}>` routes server errors to fields by `name`; editing the field clears the error
- `serialize(formData)` returns a plain object, with arrays for repeated names

### A predictable event contract

Every component follows one rule: your handler runs first, then the library acts, unless you veto.

```tsx
<Select.Item
  value="delete-account"
  onClick={(e) => {
    if (!confirmed) e.preventDefault(); // selection blocked
  }}
/>
```

This holds for every `onClick`, `onChange`, `onKeyDown`, and `onBlur` across the library. No `onSelect` vs `onClick` ambiguity, no undocumented ordering.

### Composition over configuration

Compound components with real DOM parts you can style and rearrange:

```tsx
<Combobox.Root name="city" inputValue={query} onInputValueChange={setQuery}>
  <Combobox.Input />
  <Combobox.Clear />
  <Combobox.Content>
    {cities.map((c) => (
      <Combobox.Item key={c} value={c}>{c}</Combobox.Item>
    ))}
  </Combobox.Content>
</Combobox.Root>
```

Filtering stays in your hands: you own the list, the library owns keyboard navigation, ARIA wiring, and commit semantics.

## Components

| Component | Notes |
|-----------|-------|
| `Button` | Variants, native `type` handling |
| `TextInput` | Native input styled with tokens |
| `PasswordField` | Visibility toggle |
| `Textarea` | Auto-grows via CSS `field-sizing: content` |
| `Checkbox` | Native input, `indeterminate` support |
| `Switch` | Native checkbox with `role="switch"` |
| `RadioGroup` | Native radios, platform keyboard navigation |
| `Select` | Single value, typeahead, hidden input, `Select.Clear` |
| `MultiSelect` | Multiple values, stays open while picking, `formData.getAll` |
| `Combobox` | Controlled filtering, draft revert on Escape and blur |
| `Field` | Label, description, error wiring, native validation |
| `Form` | `FormData` in `onSubmit`, server errors, focuses the first invalid field |

Every control takes `size="sm" | "md" | "lg"` (default `md`). Composite widgets size through their `Root`.

### Field

`Field.Root` connects a control to its label, description, and error text:

```tsx
<Field.Root invalid={!!error}>
  <Field.Label>Email</Field.Label>
  <TextInput name="email" />
  <Field.Description>Work email preferred</Field.Description>
  <Field.Error>{error}</Field.Error>
</Field.Root>
```

The control receives `id`, `aria-describedby`, `aria-invalid`, and `disabled` from context. Group controls such as RadioGroup are labelled through `aria-labelledby`, since a `<div role="radiogroup">` is not a labelable element.

## Theming

Tokens are CSS variables. Switch themes by setting one attribute, with no JavaScript involved:

```html
<html data-bk-theme="dark">
```

Override any token to rebrand:

```css
:root {
  --bk-color-accent: oklch(0.65 0.2 250);
}
```

## Usage

```tsx
import { Select, Field, Checkbox } from "@blankjs/react";
import "@blankjs/react/styles.css";
```

Requires React 19. The components lean on 19-only APIs: `ref` as a regular prop and `<Context>` as a provider.

To explore locally:

```bash
pnpm install
pnpm --filter playground dev
```

The playground demonstrates every component plus a full form submitting through `FormData`.

## Development

- pnpm workspaces + Turborepo
- React 19, TypeScript strict
- Vitest + Testing Library, 260+ tests across core and react
- tsdown for package builds

```bash
pnpm test
pnpm typecheck
pnpm lint
```

## Status

Published as 0.1.x. The API may change before 1.0.

## License

MIT
