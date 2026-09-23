---
"@blankjs/react": patch
---

Hover styles apply only on devices that can hover, so a tapped button,
checkbox or accordion no longer stays tinted on a touch screen.

The unfilled part of the Slider track is drawn in the border color, like an
unchecked Switch, instead of a dark fill with a thin outline that was hard to
see in the dark theme.

New token: `--bk-radius-full`.
