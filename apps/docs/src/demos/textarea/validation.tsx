import { Button, Field, Form, Textarea } from "@blankjs/react";

export const TextareaValidation = () => (
  <Form onSubmit={() => {}}>
    <Field.Root
      required
      validationMode="blur"
      errorMessages={{
        valueMissing: "Tell us something",
        tooShort: "At least 20 characters",
      }}
    >
      <Field.Label>Feedback</Field.Label>
      <Textarea name="feedback" minLength={20} rows={2} />
      <Field.Error />
    </Field.Root>

    <Button type="submit">Send</Button>
  </Form>
);
