import { useState } from "react";
import {
  Button,
  Dialog,
  Field,
  Form,
  TextInput,
  serialize,
} from "@blankjs/react";

export const DialogForm = () => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState<string>();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline">Edit profile</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Edit profile</Dialog.Title>

        <Dialog.Description>
          The form inside is a plain form — values land in FormData.
        </Dialog.Description>

        <Form
          onSubmit={(data) => {
            setSubmitted(JSON.stringify(serialize(data)));
            setOpen(false);
          }}
        >
          <Field.Root name="username" required>
            <Field.Label>Username</Field.Label>
            <TextInput name="username" />
            <Field.Error>Enter a username</Field.Error>
          </Field.Root>

          <Button type="submit">Save</Button>
        </Form>
      </Dialog.Content>

      {submitted && <output>{submitted}</output>}
    </Dialog.Root>
  );
};
