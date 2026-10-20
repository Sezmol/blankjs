---
"@blankjs/react": minor
"@blankjs/core": minor
---

New `CheckboxGroup.Root` and `CheckboxGroup.Item`: native checkboxes that
share one `string[]` value. `required` means at least one enabled item is
checked, Field shows the error and focuses the first item, and Field's
`validate` receives the checked values joined by commas. Form reset returns
the group to `defaultValue`.

Field now exposes `refreshControl` in its context (a new required member of
`FieldContextValue` in core), and an error that is already shown follows a
value the parent sets, without waiting for the next user event.
