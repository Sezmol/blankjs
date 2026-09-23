---
"@blankjs/react": patch
---

Opening a Select, Combobox or MultiSelect no longer scrolls the page. The
highlighted option used to call `scrollIntoView` before the popup was
positioned, so a control far down the page sent the window back to the top.
Only the listbox scrolls now, and the selected option is fully in view once
the list opens.

The listbox is also capped to the space left in the viewport, so arrow keys
never move the highlighted option off screen. The cap comes from
`--bk-available-height`, which every positioned popup now receives.
