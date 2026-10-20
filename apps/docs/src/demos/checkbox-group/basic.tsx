import { Button, CheckboxGroup, Field, Form } from "@blankjs/react";

export const CheckboxGroupBasic = () => (
  <Form onSubmit={() => {}}>
    <Field.Root
      required
      errorMessages={{ valueMissing: "Pick at least one topping." }}
    >
      <Field.Label>Toppings</Field.Label>
      <CheckboxGroup.Root name="toppings">
        <CheckboxGroup.Item value="cheese">Cheese</CheckboxGroup.Item>
        <CheckboxGroup.Item value="mushrooms">Mushrooms</CheckboxGroup.Item>
        <CheckboxGroup.Item value="olives" disabled>
          Olives (sold out)
        </CheckboxGroup.Item>
      </CheckboxGroup.Root>
      <Field.Error />
    </Field.Root>

    <Button type="submit">Order</Button>
  </Form>
);
