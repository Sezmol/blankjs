---
"@blankjs/react": minor
---

**Breaking:** the empty value of `Select` and `Combobox` is `null` now.

`value` and `defaultValue` take `string | null`, and `onValueChange` receives
`string | null`. `Clear` reports `null`, and so does a form reset when there
is no `defaultValue`. `undefined` still means uncontrolled.

This fixes a controlled Select that could not be cleared: with
`useState<string>()` the parent handed back `undefined`, the Select read that
as "uncontrolled" and kept showing the old value.

To migrate:

```tsx
// before
const [country, setCountry] = useState<string>();

// after
const [country, setCountry] = useState<string | null>(null);
```

- Type your state and handlers as `string | null`. TypeScript points at every
  handler that still expects `string | undefined`.
- Replace `value === undefined` checks with `value === null`.
- To clear a controlled Select or Combobox from code, set `null`. Setting
  `undefined` switches it to uncontrolled.

MultiSelect is unchanged: its empty value is still `[]`.
