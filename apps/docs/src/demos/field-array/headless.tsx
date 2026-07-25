import { useState } from "react";
import {
  Button,
  Field,
  Form,
  TextInput,
  serialize,
  useFieldArray,
} from "@blankjs/react";

interface Step {
  text: string;
}

const recipe: Step[] = [
  { text: "Warm the pan" },
  { text: "Add the butter" },
  { text: "Crack two eggs" },
];

export const FieldArrayHeadless = () => {
  const [submitted, setSubmitted] = useState<string>();

  const { rows, append, remove, move, canRemove } = useFieldArray({
    name: "steps",
    defaultItems: recipe,
    minItems: 1,
  });

  return (
    <Form onSubmit={(data) => setSubmitted(JSON.stringify(serialize(data)))}>
      <ol className="demo-steps">
        {rows.map((row) => (
          <li key={row.key} className="demo-row">
            <Field.Root name={row.name("text")}>
              <Field.Label>Step {row.position}</Field.Label>
              <TextInput name={row.name("text")} defaultValue={row.item?.text} />
            </Field.Root>

            <Button
              variant="ghost"
              size="sm"
              aria-label={`Move step ${row.position} up`}
              disabled={row.position === 1}
              onClick={() => move(row.key, row.position - 1)}
            >
              ↑
            </Button>

            <Button
              variant="ghost"
              size="sm"
              aria-label={`Move step ${row.position} down`}
              disabled={row.position === rows.length}
              onClick={() => move(row.key, row.position + 1)}
            >
              ↓
            </Button>

            <Button
              variant="ghost"
              size="sm"
              color="danger"
              aria-label={`Remove step ${row.position}`}
              disabled={!canRemove}
              onClick={() => remove(row.key)}
            >
              ✕
            </Button>
          </li>
        ))}
      </ol>

      <Button variant="ghost" onClick={append}>
        + Add step
      </Button>

      <div className="demo-actions">
        <Button type="submit">Submit</Button>
      </div>

      {submitted && <output>{submitted}</output>}
    </Form>
  );
};
