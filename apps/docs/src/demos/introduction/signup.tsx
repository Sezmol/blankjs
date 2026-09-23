import { useState } from "react";
import {
  Button,
  Checkbox,
  Field,
  Form,
  Select,
  TextInput,
  serialize,
} from "@blankjs/react";

export const IntroductionSignup = () => {
  const [submitted, setSubmitted] = useState<string>();

  return (
    <Form onSubmit={(data) => setSubmitted(JSON.stringify(serialize(data)))}>
      <Field.Root
        required
        errorMessages={{
          valueMissing: "Enter an email",
          typeMismatch: "That does not look like an email",
        }}
      >
        <Field.Label>Work email</Field.Label>
        <TextInput name="email" type="email" />
        <Field.Error />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Team size</Field.Label>

        <Select.Root name="team">
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>

          <Select.Content>
            <Select.Item value="Just me">Just me</Select.Item>
            <Select.Item value="2 to 10">2 to 10</Select.Item>
            <Select.Item value="More than 10">More than 10</Select.Item>
          </Select.Content>
        </Select.Root>

        <Field.Error>Pick a team size</Field.Error>
      </Field.Root>

      <Field.Root required>
        <label className="demo-check">
          <Checkbox name="terms" />
          I accept the terms
        </label>

        <Field.Error>Accept the terms to continue</Field.Error>
      </Field.Root>

      <Button type="submit">Create account</Button>

      {submitted && <output>{submitted}</output>}
    </Form>
  );
};
