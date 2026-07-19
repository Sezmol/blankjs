import { Button, Field, Form, PasswordField, serialize } from "@blankjs/react";
import { useState } from "react";

export const FieldCrossField = () => {
  const [output, setOutput] = useState("");

  return (
    <Form onSubmit={(data) => setOutput(JSON.stringify(serialize(data)))}>
      <Field.Root required>
        <Field.Label>Password</Field.Label>
        <PasswordField name="password" />
        <Field.Error />
      </Field.Root>

      <Field.Root
        required
        validationMode="blur"
        validate={(value, formData) =>
          value !== formData.get("password")
            ? "Passwords do not match"
            : null
        }
      >
        <Field.Label>Confirm password</Field.Label>
        <PasswordField name="confirm" />
        <Field.Error />
      </Field.Root>

      <Button type="submit">Sign up</Button>

      {output && <pre>{output}</pre>}
    </Form>
  );
};
