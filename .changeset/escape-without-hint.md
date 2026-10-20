---
"@blankjs/react": patch
---

In browsers without `popover="hint"` (Safari), Escape now closes a tooltip
shown by hover even when focus is in another field, as it already did in
Chromium and Firefox.
