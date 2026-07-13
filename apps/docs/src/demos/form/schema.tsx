import { useState } from "react";
import { z } from "zod";
import {
  Button,
  Field,
  Form,
  PasswordField,
  TextInput,
} from "@blankjs/react";

const schema = z
  .object({
    username: z.string().min(3, "At least 3 characters"),
    age: z.coerce.number().min(18, "Must be 18 or older"),
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const FormSchema = () => {
  const [submitted, setSubmitted] = useState<string>();

  return (
    <Form
      schema={schema}
      onSubmit={(data) => {
        // data: { username: string; age: number; password: string; confirm: string }
        setSubmitted(JSON.stringify(data));
      }}
    >
      <Field.Root name="username">
        <Field.Label>Username</Field.Label>
        <TextInput name="username" />
        <Field.Error />
      </Field.Root>

      <Field.Root name="age">
        <Field.Label>Age</Field.Label>
        <TextInput name="age" inputMode="numeric" />
        <Field.Error />
      </Field.Root>

      <Field.Root name="password">
        <Field.Label>Password</Field.Label>
        <PasswordField name="password" />
        <Field.Error />
      </Field.Root>

      <Field.Root name="confirm">
        <Field.Label>Confirm password</Field.Label>
        <PasswordField name="confirm" />
        <Field.Error />
      </Field.Root>

      <Button type="submit">Sign up</Button>

      {submitted && <output>{submitted}</output>}
    </Form>
  );
};
