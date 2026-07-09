import { Field, TextInput } from "@blankjs/react";
import { Section } from "./section";

export const TextInputSection = () => (
  <Section title="TextInput">
    <Field.Root className="pg-field">
      <Field.Label>Name</Field.Label>
      <TextInput placeholder="Enter your name" />
      <Field.Description>As in your passport</Field.Description>
    </Field.Root>

    <Field.Root invalid className="pg-field">
      <Field.Label>Email</Field.Label>
      <TextInput placeholder="you@example.com" defaultValue="not-an-email" />
      <Field.Error>Enter a valid email</Field.Error>
    </Field.Root>

    <Field.Root disabled className="pg-field">
      <Field.Label>Disabled</Field.Label>
      <TextInput placeholder="Cannot type here" />
    </Field.Root>
  </Section>
);
