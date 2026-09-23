---
"@blankjs/react": minor
---

Every component exports its props type from the package root:
`SelectRootProps`, `DialogContentProps`, `PinInputProps` and so on, one per
part. Wrapping a component no longer needs `ComponentProps<typeof ...>`.

```ts
import type { SelectRootProps } from "@blankjs/react";
```

`Field.Control` has no props type of its own yet, since `FieldControlProps`
already names the result of `useFieldControlProps`.
