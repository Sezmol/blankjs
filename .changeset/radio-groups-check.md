---
"@blankjs/react": patch
---

`validate` on a `Field.Root` around a RadioGroup runs on mount and after a form
reset. An untouched group whose rule fails now blocks submit, and a reset puts
the group's validity back in line with the restored value.
