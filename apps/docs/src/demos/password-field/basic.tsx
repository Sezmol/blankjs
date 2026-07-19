import { Field, PasswordField } from "@blankjs/react";

export const PasswordFieldBasic = () => (
  <>
    <Field.Root>
      <Field.Label>Password</Field.Label>
      <PasswordField name="password" defaultValue="hunter2" />
    </Field.Root>

    <Field.Root disabled>
      <Field.Label>Disabled</Field.Label>
      <PasswordField name="old" defaultValue="secret" />
    </Field.Root>
  </>
);
