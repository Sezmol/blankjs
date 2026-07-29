import { useState } from "react";
import { Button, Field, Form, PinInput, serialize } from "@blankjs/react";
import { Section } from "./section";

export const PinInputSection = () => {
  const [completed, setCompleted] = useState("");
  const [output, setOutput] = useState("");

  return (
    <Section title="PinInput">
      <Form
        className="pg-form"
        onSubmit={(data) => setOutput(JSON.stringify(serialize(data)))}
      >
        <Field.Root required>
          <Field.Label>Verification code</Field.Label>
          <PinInput
            name="code"
            length={6}
            groups={[3, 3]}
            onComplete={setCompleted}
          />
          <Field.Error className="pg-error">Enter all six digits</Field.Error>
        </Field.Root>

        <div className="pg-row">
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="outline">
            Reset
          </Button>
        </div>
      </Form>

      <div className="pg-row">
        <PinInput length={4} size="sm" defaultValue="12" />
        <PinInput length={4} mask defaultValue="1234" />
        <PinInput length={4} type="alphanumeric" size="lg" />
        <PinInput length={4} disabled defaultValue="99" />
      </div>

      {completed && <p className="pg-note">onComplete: {completed}</p>}
      {output && <pre className="pg-output">{output}</pre>}
    </Section>
  );
};
