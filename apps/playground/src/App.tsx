import {
  Field,
  PasswordField,
  TextInput,
  Select,
  Button,
} from "@blankjs/react";
import "@blankjs/react/styles.css";
import { useState } from "react";

import "./index.css";
import { countries } from "./countries";

function App() {
  const [invalid, setInvalid] = useState(false);

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: "var(--bk-color-surface)",
        color: "var(--bk-color-text)",
        height: "100%",
      }}
    >
      <Field.Root
        invalid={invalid}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "fit-content",
        }}
      >
        <Field.Label>Name</Field.Label>

        <TextInput placeholder="Enter your name" />

        <Field.Description>Please enter your name</Field.Description>

        {invalid && <Field.Error>Name is required</Field.Error>}
      </Field.Root>

      <Field.Root
        invalid={invalid}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "fit-content",
        }}
      >
        <Field.Label>Name</Field.Label>

        <PasswordField placeholder="Enter your password" />

        <Field.Description>Please enter your name</Field.Description>

        {invalid && <Field.Error>Name is required</Field.Error>}
      </Field.Root>

      <Field.Root
        invalid={invalid}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "fit-content",
        }}
      >
        <Field.Label>Name</Field.Label>

        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Select value">
              {(value) => `Value: ${value}`}
            </Select.Value>
          </Select.Trigger>
          <Select.Content>
            {countries.map(({ label, value }) => (
              <Select.Item key={value} value={value} style={{ padding: 12 }}>
                {label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Field.Description>Please enter your name</Field.Description>

        {invalid && <Field.Error>Name is required</Field.Error>}
      </Field.Root>

      <Button
        asChild
        variant="outline"
        size="md"
        onClick={() => setInvalid((v) => !v)}
        style={{ marginTop: 16 }}
      >
        <a href="#"> toggle error</a>
      </Button>
    </div>
  );
}

export default App;
