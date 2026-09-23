---
"@blankjs/react": patch
---

Opening a Select, Combobox or MultiSelect no longer scrolls the page. The
highlighted option used to call `scrollIntoView` before the popup was
positioned, so a control far down the page sent the window back to the top.
Only the listbox scrolls now.
