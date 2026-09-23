---
"@blankjs/react": patch
---

Text contrast now reaches WCAG AA in both themes.

In the dark theme, text on the accent is near-black instead of white, so solid
and danger buttons stay readable, on hover too. Popups, dialogs and tooltips sit
a step lighter than inputs instead of sharing their color, and muted text is
brighter. In the light theme the danger button is a shade darker. Field, Form
and FieldArray errors use `--bk-color-danger-text`.

If you set a dark `--bk-color-accent` for the dark theme, set
`--bk-color-text-on-accent` to a light color as well.

New palette steps: `--bk-gray-650`, `--bk-gray-750`, `--bk-red-700`.
