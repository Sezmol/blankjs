---
"@blankjs/react": patch
---

`Dialog.Close`, `FieldArray.Add` and `FieldArray.Remove` sink slightly under
the cursor when pressed, the same as Button. Reduced motion turns it off like
every other movement.
