---
"@blankjs/react": patch
---

Better contrast in both themes.

In the dark theme, popups, dialogs and tooltips sit a step lighter than inputs
instead of sharing their color, the hover and list highlight color moved with
them, and muted text is brighter. In the light theme `--bk-color-danger` is a
shade darker, which darkens the danger button, invalid borders and focus rings,
and checked invalid checkboxes, radios and switches. Field, Form and FieldArray
errors use `--bk-color-danger-text`, which reads well in both themes.

New palette steps: `--bk-gray-350`, `--bk-gray-650`, `--bk-gray-750`,
`--bk-red-700`.
