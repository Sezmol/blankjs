---
"@blankjs/react": minor
---

`schema` on `Form` works without `onSubmit`.

Before, a schema did nothing unless `onSubmit` was set, so
`<Form schema={schema} action={save}>` sent invalid data straight to the action.
Now the schema checks the form just before the browser sends it. An issue stops
the submit, lands on its field and moves focus there. A clean result lets the
submit go on to `action`, a React action or a plain URL, with the clicked
button's `name` and `value` intact.

The action gets the raw FormData; the parsed output still goes only to
`onSubmit`. The check has to finish inside the submit event, so the schema must
be synchronous in this mode. An async schema blocks the submit and logs an
error, and a schema that throws blocks it and reports the exception.
