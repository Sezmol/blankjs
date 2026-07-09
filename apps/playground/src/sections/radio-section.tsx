import { Field, RadioGroup } from "@blankjs/react";
import { Section } from "./section";

export const RadioSection = () => (
  <Section title="RadioGroup">
    <Field.Root className="pg-field">
      <Field.Label>Plan</Field.Label>
      <RadioGroup.Root defaultValue="pro">
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
        <RadioGroup.Item value="enterprise" disabled>
          Enterprise (disabled)
        </RadioGroup.Item>
      </RadioGroup.Root>
      <Field.Description>Arrow keys move the selection</Field.Description>
    </Field.Root>

    <Field.Root invalid className="pg-field">
      <Field.Label>Required choice</Field.Label>
      <RadioGroup.Root>
        <RadioGroup.Item value="yes">Yes</RadioGroup.Item>
        <RadioGroup.Item value="no">No</RadioGroup.Item>
      </RadioGroup.Root>
      <Field.Error>Pick one</Field.Error>
    </Field.Root>
  </Section>
);
