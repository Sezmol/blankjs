import { useState } from "react";
import { z } from "zod";
import { Button, Field, FieldArray, Form, TextInput } from "@blankjs/react";

const schema = z.object({
  team: z
    .array(
      z.object({
        email: z.email("Enter a valid email"),
      }),
    )
    .min(2, "A team needs at least two people"),
});

type Teammate = z.infer<typeof schema>["team"][number];

export const FieldArraySchema = () => {
  const [submitted, setSubmitted] = useState<string>();

  return (
    <Form
      schema={schema}
      onSubmit={(data) => {
        // data: { team: { email: string }[] }
        setSubmitted(JSON.stringify(data));
      }}
    >
      <FieldArray<Teammate> name="team" minItems={1}>
        {({ rows }) => (
          <>
            {rows.map((row) => (
              <div key={row.key} className="demo-row">
                <Field.Root name={row.name("email")}>
                  <Field.Label>Email {row.position}</Field.Label>
                  <TextInput name={row.name("email")} />
                  <Field.Error />
                </Field.Root>

                <FieldArray.Remove
                  row={row}
                  aria-label={`Remove ${row.position}`}
                >
                  ✕
                </FieldArray.Remove>
              </div>
            ))}

            <FieldArray.Add>+ Add teammate</FieldArray.Add>
            <FieldArray.Error />
          </>
        )}
      </FieldArray>

      <Button type="submit">Submit</Button>

      {submitted && <output>{submitted}</output>}
    </Form>
  );
};
