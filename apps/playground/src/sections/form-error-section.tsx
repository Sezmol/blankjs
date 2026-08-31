import { useState } from "react";
import { Button, Field, Form, TextInput } from "@blankjs/react";
import { z } from "zod";
import { Section } from "./section";

const share = z.coerce.number().min(0, "Cannot be negative");

const schema = z
  .object({ design: share, dev: share, marketing: share })
  .refine(
    (v) => v.design + v.dev + v.marketing === 100,
    "The three shares must add up to 100",
  );

export const FormErrorSection = () => {
  const [declined, setDeclined] = useState(false);
  const [output, setOutput] = useState("");

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await new Promise((r) => setTimeout(r, 600));

    setOutput(JSON.stringify(data));
  };

  return (
    <Section title="Form.Error">
      <p className="pg-hint">
        Split the budget so the three add up to 100. Anything else is nobody's
        fault in particular, so the message goes to Form.Error. Type a negative
        number to get a field message at the same time.
      </p>

      <Form
        className="pg-form"
        schema={schema}
        onSubmit={onSubmit}
        error={declined ? "Card declined, try another one" : undefined}
      >
        <Form.Error />

        <Field.Root name="design">
          <Field.Label>Design</Field.Label>
          <TextInput name="design" inputMode="numeric" defaultValue="40" />
          <Field.Error />
        </Field.Root>

        <Field.Root name="dev">
          <Field.Label>Development</Field.Label>
          <TextInput name="dev" inputMode="numeric" defaultValue="40" />
          <Field.Error />
        </Field.Root>

        <Field.Root name="marketing">
          <Field.Label>Marketing</Field.Label>
          <TextInput name="marketing" inputMode="numeric" defaultValue="10" />
          <Field.Error />
        </Field.Root>

        <div className="pg-row">
          <Button type="submit">Save</Button>
          <Button type="reset" variant="outline">
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeclined((d) => !d)}
          >
            {declined ? "Clear server error" : "Fake a server error"}
          </Button>
        </div>
      </Form>

      {output && <pre className="pg-output">{output}</pre>}
    </Section>
  );
};
