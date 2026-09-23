---
"@blankjs/react": patch
---

Form controls get their own border color, `--bk-color-border-control`, with at
least 3:1 contrast against the field and the page (WCAG 1.4.11). Inputs, select
triggers, PinInput cells, checkboxes, radios, the unchecked Switch and the
Slider track use it. Cards, popups, tabs and accordions keep the lighter
`--bk-color-border`. `--bk-color-border-hover` moved one step further so hover
still reads stronger than the resting border.

If you overrode `--bk-color-border` to restyle inputs, override
`--bk-color-border-control` instead.

New palette step: `--bk-gray-450`.
