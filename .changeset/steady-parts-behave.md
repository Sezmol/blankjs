---
"@blankjs/react": patch
---

Component fixes.

- Select, MultiSelect and Combobox inside a modal Dialog open above the
  backdrop and take clicks. Their popup now renders into the nearest
  `<dialog>`. An explicit `container` still wins.
- Picking an option with the mouse keeps focus on the Select or MultiSelect
  trigger instead of dropping it to `<body>`.
- Combobox commits an item on `click` instead of `pointerdown`, so scrolling
  the list with a finger does not pick the item under it.
- Select and MultiSelect triggers respect `preventDefault()` in your `onClick`
  and `onKeyDown`, like every other part.
- A controlled Popover, Menu or Tooltip with `open={false}` stays closed when
  its trigger is clicked.
- Dialog no longer closes when a text selection that started inside it ends
  over the backdrop. Closing the `<dialog>` outside React, with a
  `method="dialog"` form or `dialog.close()`, updates its open state, so it
  can be opened again.
- NumberField with `step="any"` no longer throws `InvalidStateError` from its
  buttons: they step by 1 and keep the decimals. `readOnly` disables the
  buttons.
- Tabs without a `defaultValue` can be reached with the keyboard, and a tab
  value with a space no longer breaks the `aria-controls` link.
