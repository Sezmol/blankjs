import { useState } from "react";
import { Button, Field, Form, NumberField, serialize } from "@blankjs/react";
import { Section } from "./section";

export const NumberFieldSection = () => {
  const [qty, setQty] = useState("2");

  return (
    <Section title="NumberField">
      <Field.Root>
        <Field.Label>Controlled: {qty}</Field.Label>
        <NumberField
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          min={0}
          max={10}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Steps of 25 (0–100)</Field.Label>
        <NumberField defaultValue={50} min={0} max={100} step={25} size="sm" />
      </Field.Root>

      <Field.Root>
        <Field.Label>Disabled</Field.Label>
        <NumberField defaultValue={7} disabled />
      </Field.Root>

      <Form
        onSubmit={(fd) => {
          console.log(serialize(fd));
        }}
      >
        <Field.Root required errorMessages={{ valueMissing: "How many?" }}>
          <Field.Label>In a form (name="guests")</Field.Label>

          <NumberField name="guests" min={1} max={8} size="lg" />

          <Field.Error className="pg-error" />
        </Field.Root>

        <Button type="submit">Read FormData</Button>
        <Button type="reset">Reset</Button>
      </Form>
    </Section>
  );
};
