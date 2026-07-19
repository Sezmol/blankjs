import { useState } from "react";
import { Button, Checkbox, Form, serialize } from "@blankjs/react";

export const CheckboxForm = () => {
  const [output, setOutput] = useState("");

  return (
    <Form onSubmit={(data) => setOutput(JSON.stringify(serialize(data)))}>
      <label className="demo-check">
        <Checkbox name="newsletter" value="weekly" defaultChecked />
        Weekly newsletter
      </label>

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
