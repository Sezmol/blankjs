---
"@blankjs/react": patch
---

Controlled Popover and Menu.

- While the parent keeps `open={false}`, a click on the trigger no longer shows
  the popup for a frame and no longer closes other open popovers on the way.
  The browser's own opening is canceled and the parent gets
  `onOpenChange(true)`.
- A Menu the parent keeps open, after the browser closes it on a click outside:
  the trigger reports `aria-expanded="false"`, and a click or an arrow key on
  the trigger opens it again with focus inside.
