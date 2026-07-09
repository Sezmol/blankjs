import { Field, Textarea } from "@blankjs/react";
import { Section } from "./section";

export const TextareaSection = () => (
  <Section title="Textarea">
    <Field.Root className="pg-field">
      <Field.Label>Bio</Field.Label>
      <Textarea placeholder="Tell about yourself" />
      <Field.Description>Grows with content in Chromium</Field.Description>
    </Field.Root>

    <Field.Root invalid className="pg-field">
      <Field.Label>Required</Field.Label>
      <Textarea />
      <Field.Error>This field is required</Field.Error>
    </Field.Root>
  </Section>
);
