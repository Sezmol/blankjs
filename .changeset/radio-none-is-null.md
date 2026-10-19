---
"@blankjs/react": minor
---

**Breaking:** the empty value of `RadioGroup` is `null` now, the same as
`Select` and `Combobox`.

`value` and `defaultValue` take `string | null`, and `onValueChange` receives
`string | null`. A controlled parent can clear the group by passing `null`;
`undefined` still means uncontrolled. A form reset with no `defaultValue`
reports `null`.

To migrate, widen the state you pass to `onValueChange`:
`useState<string | null>(...)`.
