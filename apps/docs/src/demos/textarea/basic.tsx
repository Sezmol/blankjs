import { Field, Textarea } from "@blankjs/react";

export const TextareaBasic = () => (
  <Field.Root>
    <Field.Label>Bio</Field.Label>
    <Textarea
      name="bio"
      placeholder="Keep typing — the field grows with the text."
    />
    <Field.Description>No resize handle dragging required.</Field.Description>
  </Field.Root>
);
