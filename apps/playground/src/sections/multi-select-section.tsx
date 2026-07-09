import { Field, MultiSelect } from "@blankjs/react";
import { Section } from "./section";
import { countries } from "../countries";

const labelOf = new Map(countries.map(({ value, label }) => [value, label]));

export const MultiSelectSection = () => (
  <Section title="MultiSelect">
    <Field.Root className="pg-field">
      <Field.Label>Visited countries</Field.Label>
      <MultiSelect.Root defaultValue={[]}>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Pick countries">
            {(values) => values.map((v) => labelOf.get(v)).join(", ")}
          </MultiSelect.Value>
        </MultiSelect.Trigger>
        <MultiSelect.Clear />
        <MultiSelect.Content>
          {countries.map(({ label, value }) => (
            <MultiSelect.Item key={value} value={value}>
              {label}
            </MultiSelect.Item>
          ))}
        </MultiSelect.Content>
      </MultiSelect.Root>
      <Field.Description>List stays open while picking</Field.Description>
    </Field.Root>
  </Section>
);
