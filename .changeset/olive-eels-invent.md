---
"@blankjs/react": minor
---

Motion layer. Every animation now runs on shared easing, duration and distance
tokens instead of the browser's built-in `ease`, and one switch turns motion off:
`prefers-reduced-motion: reduce` or `data-bk-motion="off"` on any element.
Movement stops, fades keep running.

Overlays appear anchored to their trigger rather than growing from their own
middle, Tooltip gained the exit animation it never had, buttons sink slightly
under the cursor, and the checkbox mark pops in and out instead of appearing
whole.
