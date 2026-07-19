import { useState } from "react";
import { Button, Field, Form, serialize, Switch } from "@blankjs/react";

export const SwitchForm = () => {
  const [output, setOutput] = useState("");

  return (
    <Form onSubmit={(data) => setOutput(JSON.stringify(serialize(data)))}>
      <Field.Root>
        <label className="demo-check">
          <Switch name="public" value="on" defaultChecked />
          Public profile
        </label>
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
