import { Button, Field, Form, TextInput } from "@blankjs/react";

export const FieldValidate = () => (
  <Form onSubmit={() => {}}>
    <Field.Root
      required
      validationMode="change"
      validate={(value) => (value.includes(" ") ? "No spaces allowed" : null)}
    >
      <Field.Label>Username</Field.Label>

      <TextInput name="username" />

      <Field.Error />
    </Field.Root>

    <Button type="submit">Submit</Button>
  </Form>
);
