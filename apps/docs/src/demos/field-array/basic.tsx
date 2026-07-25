import { useState } from "react";
import {
  Button,
  Field,
  FieldArray,
  Form,
  TextInput,
  serialize,
} from "@blankjs/react";

interface Guest {
  name: string;
  email: string;
}

const invited: Guest[] = [{ name: "Ann", email: "ann@party.dev" }];

export const FieldArrayBasic = () => {
  const [submitted, setSubmitted] = useState<string>();

  return (
    <Form onSubmit={(data) => setSubmitted(JSON.stringify(serialize(data)))}>
      <FieldArray name="guests" defaultItems={invited} minItems={1}>
        {({ rows }) => (
          <>
            {rows.map((row) => (
              <div key={row.key} className="demo-row">
                <Field.Root name={row.name("name")}>
                  <Field.Label>Name {row.position}</Field.Label>
                  <TextInput
                    name={row.name("name")}
                    defaultValue={row.item?.name}
                  />
                </Field.Root>

                <Field.Root name={row.name("email")}>
                  <Field.Label>Email {row.position}</Field.Label>
                  <TextInput
                    name={row.name("email")}
                    type="email"
                    defaultValue={row.item?.email}
                  />
                </Field.Root>

                <FieldArray.Remove row={row} aria-label={`Remove guest ${row.position}`}>
                  ✕
                </FieldArray.Remove>
              </div>
            ))}

            <FieldArray.Add>+ Add guest</FieldArray.Add>
          </>
        )}
      </FieldArray>

      <div className="demo-actions">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>

      {submitted && <output>{submitted}</output>}
    </Form>
  );
};
