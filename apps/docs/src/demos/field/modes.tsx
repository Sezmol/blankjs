import { Button, Field, Form, TextInput } from "@blankjs/react";

export const FieldModes = () => (
  <Form onSubmit={() => {}}>
    <Field.Root required validationMode="blur">
      <Field.Label>Reveals on blur</Field.Label>
      <TextInput name="on-blur" minLength={4} />
      <Field.Error />
    </Field.Root>

    <Field.Root required validationMode="change">
      <Field.Label>Reveals on every change</Field.Label>
      <TextInput name="on-change" minLength={4} />
      <Field.Error />
    </Field.Root>

    <Button type="submit">Submit</Button>
  </Form>
);
