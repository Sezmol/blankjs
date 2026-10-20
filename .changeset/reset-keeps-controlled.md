---
"@blankjs/react": patch
---

A real `form.reset()` no longer moves a controlled Checkbox, Switch or
RadioGroup away from its `checked` or `value` prop. The browser resets them to
their first rendered state; when the parent does not take the default from
`onCheckedChange` or `onValueChange`, the component now puts the prop's value
back. `Field.Root` checks its rule after every control has finished resetting.
