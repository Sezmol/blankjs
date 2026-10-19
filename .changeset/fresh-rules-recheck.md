---
"@blankjs/core": patch
"@blankjs/react": patch
---

`validate` on `Field.Root` no longer goes stale.

- A cross-field rule runs again when any other field of the form changes. A
  password confirmation that matched no longer lets the form submit after the
  password itself is edited. An error that is already on screen follows the
  change; a field the user has not reached stays quiet.
- Every rule of the form runs once more at the start of a submit attempt, before
  the browser checks validity, so a value set from code without events is
  caught too.
- A new `validate` applies on the next render, without waiting for input.
- Removing `validate` clears the error it had set. A message you set yourself
  with `setCustomValidity` is left alone.
