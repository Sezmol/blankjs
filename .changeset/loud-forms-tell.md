---
"@blankjs/react": minor
---

`Form.Error` and the `error` prop on `Form`.

Some errors belong to no field: a declined card, a locked account, shares that
must add up to 100. Pass them as `error`, or return them from the schema as an
issue without a `path`, and `Form.Error` shows them.

```tsx
<Form error={declined ? "Card declined" : undefined}>
  <Form.Error />
  ...
</Form>
```

Before this, a schema issue without a `path` was dropped: the submit failed,
nothing appeared and focus did not move.

`Form.Error` renders `role="alert"` and leaves focus alone. The message stays
until the next submit or a reset, since no single field edit can fix it. Your
`error` prop wins over the schema's and survives a reset, the same way
`errors` does.
