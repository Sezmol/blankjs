---
"@blankjs/react": patch
---

Better contrast in both themes.

In the dark theme, popups, dialogs and tooltips sit a step lighter than inputs
instead of sharing their color, and muted text is brighter. In the light theme
the danger button is a shade darker. Field, Form and FieldArray errors use
`--bk-color-danger-text`, which reads well in both themes.

New palette steps: `--bk-gray-650`, `--bk-gray-750`, `--bk-red-700`.
