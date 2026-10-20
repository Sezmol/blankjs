---
"@blankjs/react": patch
---

In Firefox, a failed submit no longer leaves the browser's validation popup
stuck under a PinInput, Select, Combobox or MultiSelect outside a Field, where
it could block clicks below the control.
