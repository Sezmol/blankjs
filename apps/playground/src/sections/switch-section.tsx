import { Field, Switch } from "@blankjs/react";
import { Section } from "./section";

export const SwitchSection = () => (
  <Section title="Switch">
    <Field.Root className="pg-inline">
      <Switch defaultChecked />
      <Field.Label>Notifications</Field.Label>
    </Field.Root>

    <Field.Root invalid className="pg-inline">
      <Switch defaultChecked />
      <Field.Label>Invalid</Field.Label>
    </Field.Root>

    <Field.Root disabled className="pg-inline">
      <Switch />
      <Field.Label>Disabled</Field.Label>
    </Field.Root>
  </Section>
);
