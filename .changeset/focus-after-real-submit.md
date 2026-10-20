---
"@blankjs/react": patch
---

Focus moves to the first invalid field only when a submit really happened and
failed. A `checkValidity()` call inside a submit button's click handler that
cancels the submit, or inside `onSubmit` after a passing submit, leaves focus
where it is. Focus lands on the field the browser blocked on, even if a field
that failed an earlier `checkValidity()` was fixed in between, and
`stopPropagation()` in the click no longer matters.
