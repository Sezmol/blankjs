import { useState } from "react";
import {
  Button,
  Checkbox,
  Combobox,
  Field,
  Form,
  MultiSelect,
  RadioGroup,
  Select,
  serialize,
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
  const [errors, setErrors] = useState<Record<string, string>>();

  const onSubmit = async (data: FormData) => {
    // fake latency to show data-submitting and the re-submit guard
    await new Promise((r) => setTimeout(r, 800));

    if (data.get("name") === "admin") {
      setErrors({ name: "This name is already taken" });
      setOutput("");

      return;
    }

    setErrors(undefined);
    setOutput(JSON.stringify(serialize(data), null, 2));
  };

  return (
    <Section title="Form">
      <Form className="pg-form" onSubmit={onSubmit} errors={errors}>
        <Field.Root
          className="pg-field"
          required
          name="name"
          validationMode="change"
          validate={(value) =>
            value.includes(" ") ? "No spaces allowed" : null
          }
        >
          <Field.Label>Name</Field.Label>

          <TextInput name="name" placeholder={'Try "admin" or a space'} />

          <Field.Error className="pg-error" />
        </Field.Root>

        <Field.Root
          className="pg-field"
          required
          validationMode="blur"
          errorMessages={{
            valueMissing: "Enter your email",
            typeMismatch: "This does not look like an email",
          }}
        >
          <Field.Label>Email</Field.Label>

          <TextInput name="email" type="email" placeholder="you@example.com" />

          <Field.Error className="pg-error" />
        </Field.Root>

        <Field.Root className="pg-field" required>
          <Field.Label>Password</Field.Label>
          <TextInput name="password" type="password" />
          <Field.Error className="pg-error" />
        </Field.Root>

        <Field.Root
          className="pg-field"
          required
          validationMode="blur"
          validate={(value, formData) =>
            value !== formData.get("password")
              ? "Passwords do not match"
              : null
          }
        >
          <Field.Label>Confirm password</Field.Label>
          <TextInput name="confirm" type="password" />
          <Field.Error className="pg-error" />
        </Field.Root>

        <Field.Root className="pg-field">
          <Field.Label>About</Field.Label>
          <Textarea name="about" placeholder="A few words" />
        </Field.Root>

        <Field.Root className="pg-field" required>
          <Field.Label>Country</Field.Label>
          <Select.Root name="country">
            <Select.Trigger>
              <Select.Value placeholder="Select">
                {(value) => labelOf.get(value)}
              </Select.Value>
            </Select.Trigger>
            <Select.Clear />
            <Select.Content>
              {shortList.map(({ label, value }) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Field.Error className="pg-error">Pick a country</Field.Error>
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
      </Form>

      {output && <pre className="pg-output">{output}</pre>}
    </Section>
  );
};
