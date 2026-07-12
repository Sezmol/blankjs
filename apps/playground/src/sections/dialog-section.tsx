import {
  Button,
  Dialog,
  Field,
  Form,
  serialize,
  TextInput,
} from "@blankjs/react";
import { useState } from "react";
import { Section } from "./section";

export const DialogSection = () => {
  const [result, setResult] = useState("");

  return (
    <Section title="Dialog">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="outline">Delete account</Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Title>Are you absolutely sure?</Dialog.Title>

          <Dialog.Description>
            This action cannot be undone. Escape, backdrop click and the buttons
            below all close through the same state.
          </Dialog.Description>

          <div className="pg-row">
            <Dialog.Close>Cancel</Dialog.Close>
            <Dialog.Close className="pg-danger">Delete</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="outline">Form in dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Rename project</Dialog.Title>
          <Form
            className="pg-form"
            onSubmit={(data) => setResult(JSON.stringify(serialize(data)))}
          >
            <Field.Root required className="pg-field">
              <Field.Label>Name</Field.Label>
              <TextInput name="project" />
              <Field.Error className="pg-error" />
            </Field.Root>
            <div className="pg-row">
              <Dialog.Close>Cancel</Dialog.Close>
              <Button type="submit">Save</Button>
            </div>
          </Form>
        </Dialog.Content>
      </Dialog.Root>

      {result && <pre className="pg-output">{result}</pre>}
    </Section>
  );
};
