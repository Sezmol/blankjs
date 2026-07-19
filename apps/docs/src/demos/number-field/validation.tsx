import { Button, Field, Form, NumberField } from "@blankjs/react";

export const NumberFieldValidation = () => (
  <Form onSubmit={() => {}}>
    <Field.Root
      required
      errorMessages={{
        valueMissing: "How many guests?",
        rangeOverflow: "We only seat 8",
        badInput: "Numbers only",
      }}
    >
      <Field.Label>Guests</Field.Label>
      <NumberField name="guests" min={1} max={8} />
      <Field.Error />
    </Field.Root>

    <Button type="submit">Book</Button>
  </Form>
);
