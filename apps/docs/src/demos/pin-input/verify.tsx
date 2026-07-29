import { useState } from "react";
import { Button, Field, Form, PinInput, serialize } from "@blankjs/react";

export const PinInputVerify = () => {
  const [submitted, setSubmitted] = useState<string>();

  return (
    <Form onSubmit={(data) => setSubmitted(JSON.stringify(serialize(data)))}>
      <Field.Root required>
        <Field.Label>Verification code</Field.Label>
        <Field.Description>We sent it to you by SMS</Field.Description>

        <PinInput name="code" length={6} />

        <Field.Error>Enter all six digits</Field.Error>
      </Field.Root>

      <div className="demo-actions">
        <Button type="submit">Verify</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>

      {submitted && <output>{submitted}</output>}
    </Form>
  );
};
