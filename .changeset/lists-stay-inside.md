---
"@blankjs/react": patch
---

Select, Combobox and MultiSelect inside a Popover.

- The list renders into the nearest popover, the way it already did with a
  `<dialog>`. Picking an option no longer light-dismisses the Popover around
  it. Escape still closes the list first and the Popover second.
- A list opened while its Dialog or Popover is still animating in lands under
  its trigger. Before, it kept the position measured mid-animation, which in a
  Dialog put it hundreds of pixels away.
