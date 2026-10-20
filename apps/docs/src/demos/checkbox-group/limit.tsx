import { Button, CheckboxGroup, Field, Form } from "@blankjs/react";

export const CheckboxGroupLimit = () => (
  <Form onSubmit={() => {}}>
    <Field.Root
      validationMode="change"
      validate={(_, formData) =>
        formData.getAll("sides").length > 2 ? "Pick two at most" : null
      }
    >
      <Field.Label>Sides</Field.Label>
      <CheckboxGroup.Root name="sides">
        <CheckboxGroup.Item value="fries">Fries</CheckboxGroup.Item>
        <CheckboxGroup.Item value="salad">Salad</CheckboxGroup.Item>
        <CheckboxGroup.Item value="soup">Soup</CheckboxGroup.Item>
      </CheckboxGroup.Root>
      <Field.Error />
    </Field.Root>

    <Button type="submit">Order</Button>
  </Form>
);
