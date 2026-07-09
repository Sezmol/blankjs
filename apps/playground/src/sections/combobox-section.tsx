import { useState } from "react";
import { Combobox, Field } from "@blankjs/react";
import { Section } from "./section";
import { countries } from "../countries";

export const ComboboxSection = () => {
  const [inputValue, setInputValue] = useState("");

  const filtered = countries.filter(({ label }) =>
    label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <Section title="Combobox">
      <Field.Root className="pg-field">
        <Field.Label>Country</Field.Label>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
        >
          <Combobox.Input placeholder="Search a country" />
          <Combobox.Content>
            {filtered.map(({ label, value }) => (
              <Combobox.Item key={value} value={value}>
                {label}
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Root>
        <Field.Description>Escape reverts the draft</Field.Description>
      </Field.Root>
    </Section>
  );
};
