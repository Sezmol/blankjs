---
"@blankjs/react": minor
---

`submitForm(form, submitter?)` submits a form from code the way a click on its
submit button does: every `validate` rule on the form runs again, and the first
invalid field gets focus. Use it in place of `form.requestSubmit()` for keyboard
shortcuts and timers. A plain `requestSubmit()` still blocks an invalid submit,
but leaves focus where it was.
