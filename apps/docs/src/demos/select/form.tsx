import { useState } from "react";
import { Button, Field, Form, Select, serialize } from "@blankjs/react";

const countries: Record<string, string> = {
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
};

export const SelectForm = () => {
  const [submitted, setSubmitted] = useState<string>();

  return (
    <Form onSubmit={(data) => setSubmitted(JSON.stringify(serialize(data)))}>
      <Field.Root name="country" required>
        <Field.Label>Country</Field.Label>

        <Select.Root name="country">
          <Select.Trigger>
            <Select.Value placeholder="Select a country">
              {(value) => countries[value]}
            </Select.Value>
          </Select.Trigger>

          <Select.Clear />

          <Select.Content>
            {Object.entries(countries).map(([code, label]) => (
              <Select.Item key={code} value={code}>
                {label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Field.Error match="valueMissing">Pick a country first</Field.Error>
      </Field.Root>

      <Button type="submit">Submit</Button>

      {submitted && <output>{submitted}</output>}
    </Form>
  );
};
