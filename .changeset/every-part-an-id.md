---
"@blankjs/core": minor
"@blankjs/react": patch
---

Several `Field.Description`, `Field.Error` or `FieldArray.Error` parts can live
side by side. Each one gets its own id, an `id` you pass is kept, and the control
or group lists all of them in `aria-describedby`.

**Breaking in `@blankjs/core`:** `FieldContextValue` drops `descriptionId`,
`errorId`, `hasDescription` and `hasError` in favor of `descriptionIds` and
`errorIds`, and `registerDescription` and `registerError` take the part's id.
