import { Field, Select } from "@blankjs/react";
import { Section } from "./section";
import { countries } from "../countries";

const labelOf = new Map(countries.map(({ value, label }) => [value, label]));

export const SelectSection = () => (
  <Section title="Select">
    <Field.Root className="pg-field">
      <Field.Label>Country</Field.Label>

      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Select a country">
            {(value) => labelOf.get(value)}
          </Select.Value>
        </Select.Trigger>

        <Select.Clear />

        <Select.Content>
          {countries.map(({ label, value }) => (
            <Select.Item key={value} value={value}>
              {label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Field.Description>Typeahead works: try typing</Field.Description>
    </Field.Root>
  </Section>
);
