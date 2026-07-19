import { useState } from "react";
import { Button, Field, Form, serialize, Slider } from "@blankjs/react";

export const SliderForm = () => {
  const [output, setOutput] = useState("");

  return (
    <Form onSubmit={(data) => setOutput(JSON.stringify(serialize(data)))}>
      <Field.Root>
        <Field.Label>Brightness</Field.Label>
        <Slider name="brightness" defaultValue={75} />
      </Field.Root>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button type="submit">Read FormData</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>

      {output && <pre>{output}</pre>}
    </Form>
  );
};
