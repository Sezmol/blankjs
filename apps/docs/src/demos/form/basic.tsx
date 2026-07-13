import { useState } from "react";
import {
  Button,
  Checkbox,
  Field,
  Form,
  TextInput,
  serialize,
} from "@blankjs/react";

export const FormBasic = () => {
  const [submitted, setSubmitted] = useState<string>();

  return (
    <Form onSubmit={(data) => setSubmitted(JSON.stringify(serialize(data)))}>
      <Field.Root name="name" required>
        <Field.Label>Name</Field.Label>
        <TextInput name="name" />
        <Field.Error match="valueMissing">Enter your name</Field.Error>
      </Field.Root>

      <label className="demo-check">
        <Checkbox name="newsletter" /> Subscribe to the newsletter
      </label>

      <div className="demo-actions">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>

      {submitted && <output>{submitted}</output>}
    </Form>
  );
};
