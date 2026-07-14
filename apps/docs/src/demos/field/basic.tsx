import { Button, Field, Form, TextInput } from "@blankjs/react";

export const FieldBasic = () => (
  <Form onSubmit={() => {}}>
    <Field.Root required>
      <Field.Label>Work email</Field.Label>
      <TextInput name="email" type="email" />
      <Field.Description>We never share it with anyone.</Field.Description>
      <Field.Error match="valueMissing">Enter an email</Field.Error>
      <Field.Error match="typeMismatch">
        That does not look like an email
      </Field.Error>
    </Field.Root>

    <Button type="submit">Submit</Button>
  </Form>
);
