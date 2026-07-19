import { useState } from "react";
import { Button, Field, Form, MultiSelect, serialize } from "@blankjs/react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const MultiSelectForm = () => {
  const [output, setOutput] = useState("");

  return (
    <Form onSubmit={(data) => setOutput(JSON.stringify(serialize(data)))}>
      <Field.Root required errorMessages={{ valueMissing: "Pick at least one" }}>
        <Field.Label>Working days</Field.Label>
        <MultiSelect.Root name="days" defaultValue={["Mon", "Fri"]}>
          <MultiSelect.Trigger>
            <MultiSelect.Value placeholder="Pick days">
              {(values) => values.join(", ")}
            </MultiSelect.Value>
          </MultiSelect.Trigger>
          <MultiSelect.Clear />
          <MultiSelect.Content>
            {days.map((day) => (
              <MultiSelect.Item key={day} value={day}>
                {day}
              </MultiSelect.Item>
            ))}
          </MultiSelect.Content>
        </MultiSelect.Root>
        <Field.Error />
      </Field.Root>

      <div className="demo-actions">
        <Button type="submit">Read FormData</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>

      {output && <pre>{output}</pre>}
    </Form>
  );
};
