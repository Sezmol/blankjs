---
"@blankjs/react": patch
---

`FieldArray` sets `aria-describedby` only while `FieldArray.Error` is on
screen. Before, it pointed at the error id whenever the array had an error, so
the reference led nowhere if you never rendered `FieldArray.Error`. An Error
that shows its own children is linked too.
