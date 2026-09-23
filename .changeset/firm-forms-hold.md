---
"@blankjs/react": patch
---

Form and field fixes.

- A `validate` on `Field.Root` around a Combobox or RadioGroup no longer keeps
  the form invalid after the user picks a valid value.
- `validate` on a Field around a Select or MultiSelect runs for the initial
  value too, not only after the first change.
- `validationMode="blur"` reveals errors on Select, MultiSelect and Combobox.
  It used to stay silent on them.
- `required` works on RadioGroup: set it on `RadioGroup.Root` or on the Field
  around it, and the form will not submit until a radio is checked.
- `validate` on a Field around an unchecked Checkbox or Switch gets `""`, the
  same as FormData, instead of `"on"`.
- Select, MultiSelect and Combobox inside a disabled Field leave FormData and
  skip validation, like any disabled input. Their Clear button is hidden too.
- The FormData that `onSubmit` receives includes the submit button that was
  pressed, with its `name` and `value`, as a native submit does.
- A reset canceled with `preventDefault()` in `onReset` no longer resets
  Switch, RadioGroup, Select, MultiSelect, Combobox, FieldArray rows or schema
  errors. Checkbox and Field respect it too.
- A `<form>` rendered through a portal inside `Form` submits on its own. Its
  submit used to reach the outer `Form` and fail with `NotFoundError`.
- `errors` from the server move focus to a MultiSelect as they do to other
  fields. Focus sent to the hidden input of a Select, MultiSelect or Combobox
  right after it mounts lands on the trigger or input, not on the hidden input.
- A schema error the user already fixed no longer shows up again while the
  next async submit is running.
