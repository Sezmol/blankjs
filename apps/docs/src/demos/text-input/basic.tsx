import { Field, TextInput } from "@blankjs/react";

export const TextInputBasic = () => (
  <>
    <Field.Root>
      <Field.Label>Name</Field.Label>
      <TextInput name="name" placeholder="Ada Lovelace" />
    </Field.Root>

    <Field.Root
      required
      validationMode="blur"
      errorMessages={{
        valueMissing: "Enter your email",
        typeMismatch: "This does not look like an email",
      }}
    >
      <Field.Label>Email</Field.Label>
      <TextInput name="email" type="email" placeholder="you@example.com" />
      <Field.Error />
    </Field.Root>
  </>
);
