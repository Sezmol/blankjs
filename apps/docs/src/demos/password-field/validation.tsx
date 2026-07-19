import { Button, Field, Form, PasswordField } from "@blankjs/react";

export const PasswordFieldValidation = () => (
  <Form onSubmit={() => {}}>
    <Field.Root
      required
      validationMode="blur"
      errorMessages={{
        valueMissing: "Enter a password",
        tooShort: "At least 8 characters",
      }}
    >
      <Field.Label>New password</Field.Label>
      <PasswordField name="password" minLength={8} />
      <Field.Error />
    </Field.Root>

    <Button type="submit">Save</Button>
  </Form>
);
