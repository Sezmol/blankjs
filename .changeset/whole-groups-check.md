---
"@blankjs/core": patch
---

`useFieldRoot` validates a named radio as its whole group: the value is the
checked radio's, or empty, and the message is set on every radio in the group.
An unchecked checkbox validates as `""`, the same as FormData, instead of
`"on"`.
