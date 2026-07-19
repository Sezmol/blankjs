import { Field, NumberField } from "@blankjs/react";

export const NumberFieldStep = () => (
  <Field.Root>
    <Field.Label>Donation</Field.Label>
    <NumberField name="donation" defaultValue={50} min={0} max={100} step={25} />
    <Field.Description>
      Steps of 25 — the buttons disable at the bounds.
    </Field.Description>
  </Field.Root>
);
