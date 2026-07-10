import { useState, type ComponentProps } from "react";
import {
  Button,
  Checkbox,
  Combobox,
  Field,
  MultiSelect,
  RadioGroup,
  Select,
  Switch,
  Textarea,
  TextInput,
} from "@blankjs/react";
import { Section } from "./section";
import { countries } from "../countries";

const shortList = countries.slice(0, 8);

const labelOf = new Map(shortList.map(({ value, label }) => [value, label]));

export const FormSection = () => {
  const [output, setOutput] = useState("");
  const [comboboxInput, setComboboxInput] = useState("");

  const onSubmit: ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const result: Record<string, string | string[]> = {};

    for (const key of new Set(data.keys())) {
      const values = data.getAll(key).map(String);

      result[key] = values.length > 1 ? values : (values[0] ?? "");
    }

    setOutput(JSON.stringify(result, null, 2));
  };

  return (
    <Section title="Form">
      <form className="pg-form" onSubmit={onSubmit}>
        <Field.Root className="pg-field" required>
          <Field.Label>Name</Field.Label>

          <TextInput name="name" />

          <Field.Error className="pg-error" match="valueMissing">
            Enter your name
          </Field.Error>
        </Field.Root>

        <Field.Root className="pg-field" required validationMode="blur">
          <Field.Label>Email</Field.Label>

          <TextInput name="email" type="email" placeholder="you@example.com" />

          <Field.Error className="pg-error" match="valueMissing">
            Enter your email
          </Field.Error>

          <Field.Error className="pg-error" match="typeMismatch">
            This does not look like an email
          </Field.Error>
        </Field.Root>

        <Field.Root className="pg-field">
          <Field.Label>About</Field.Label>
          <Textarea name="about" placeholder="A few words" />
        </Field.Root>

        <Field.Root className="pg-field">
          <Field.Label>Country</Field.Label>
          <Select.Root name="country" defaultValue="AU">
            <Select.Trigger>
              <Select.Value placeholder="Select">
                {(value) => labelOf.get(value)}
              </Select.Value>
            </Select.Trigger>
            <Select.Content>
              {shortList.map(({ label, value }) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Field.Root>

        <Field.Root className="pg-field">
          <Field.Label>Dream destination</Field.Label>

          <Combobox.Root
            name="destination"
            inputValue={comboboxInput}
            onInputValueChange={setComboboxInput}
          >
            <Combobox.Input placeholder="Search" />

            <Combobox.Content>
              {shortList
                .filter(({ label }) =>
                  label.toLowerCase().includes(comboboxInput.toLowerCase()),
                )
                .map(({ label, value }) => (
                  <Combobox.Item key={value} value={value}>
                    {label}
                  </Combobox.Item>
                ))}
            </Combobox.Content>
          </Combobox.Root>
        </Field.Root>

        <Field.Root className="pg-field">
          <Field.Label>Visited</Field.Label>

          <MultiSelect.Root name="visited" defaultValue={["AU", "AT"]}>
            <MultiSelect.Trigger>
              <MultiSelect.Value placeholder="Pick a few">
                {(values) => values.map((v) => labelOf.get(v)).join(", ")}
              </MultiSelect.Value>
            </MultiSelect.Trigger>

            <MultiSelect.Content>
              {shortList.map(({ label, value }) => (
                <MultiSelect.Item key={value} value={value}>
                  {label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect.Root>
        </Field.Root>

        <Field.Root className="pg-field">
          <Field.Label>Travel style</Field.Label>
          <RadioGroup.Root name="style" defaultValue="budget">
            <RadioGroup.Item value="budget">Budget</RadioGroup.Item>
            <RadioGroup.Item value="comfort">Comfort</RadioGroup.Item>
          </RadioGroup.Root>
        </Field.Root>

        <Field.Root className="pg-inline">
          <Checkbox name="newsletter" value="yes" defaultChecked />
          <Field.Label>Subscribe to newsletter</Field.Label>
        </Field.Root>

        <Field.Root className="pg-inline">
          <Switch name="public" value="on" />
          <Field.Label>Public profile</Field.Label>
        </Field.Root>

        <div className="pg-row">
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="outline">
            Reset
          </Button>
        </div>
      </form>

      {output && <pre className="pg-output">{output}</pre>}
    </Section>
  );
};
