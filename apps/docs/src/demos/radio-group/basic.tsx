import { Field, RadioGroup } from "@blankjs/react";

export const RadioGroupBasic = () => (
  <Field.Root>
    <Field.Label>Travel style</Field.Label>
    <RadioGroup.Root name="style" defaultValue="comfort">
      <RadioGroup.Item value="budget">Budget</RadioGroup.Item>
      <RadioGroup.Item value="comfort">Comfort</RadioGroup.Item>
      <RadioGroup.Item value="luxury" disabled>
        Luxury (sold out)
      </RadioGroup.Item>
    </RadioGroup.Root>
  </Field.Root>
);
