import { Field, PasswordField } from "@blankjs/react";
import { Section } from "./section";

export const PasswordFieldSection = () => (
  <Section title="PasswordField">
    <Field.Root className="pg-field">
      <Field.Label>Password</Field.Label>
      <PasswordField placeholder="Enter password" />
      <Field.Description>At least 8 characters</Field.Description>
    </Field.Root>
  </Section>
);
