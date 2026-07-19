import { Field, NumberField } from "@blankjs/react";

export const NumberFieldBasic = () => (
  <Field.Root>
    <Field.Label>Quantity</Field.Label>
    <NumberField name="quantity" defaultValue={2} min={0} max={10} />
    <Field.Description>Between 0 and 10.</Field.Description>
  </Field.Root>
);
