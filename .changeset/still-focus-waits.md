---
"@blankjs/react": minor
---

Focus moves to the first invalid field only when the user tries to submit.

Before, `Form` moved focus on every `invalid` event, so a `checkValidity()`
call from your code pulled focus away from wherever the user was. Now that
call reveals the errors and leaves focus alone.

The move itself now comes from `Field`, so a Field inside a plain `<form>`
gets it too. Before, only `Form` did it.

A submit started from code with `requestSubmit()` does not count as an
attempt: it reveals the errors but does not move focus.
