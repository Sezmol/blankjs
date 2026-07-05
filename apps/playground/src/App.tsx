import {
  Field,
  PasswordField,
  TextInput,
  Select,
  Button,
  Combobox,
  Checkbox,
  Switch,
} from "@blankjs/react";
import "@blankjs/react/styles.css";
import { useEffect, useState } from "react";

import "./index.css";
import { countries } from "./countries";

function App() {
  const [invalid, setInvalid] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [comboboxInputValue, setComboboxInputValue] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-bk-theme", theme);
  }, [theme]);

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

        <Combobox.Root
          inputValue={comboboxInputValue}
          onInputValueChange={(value) => setComboboxInputValue(value)}
        >
          <Combobox.Input placeholder="Select value" />

          <Combobox.Content>
            {countries
              .filter(({ label }) =>
                label
                  .toLocaleLowerCase()
                  .includes(comboboxInputValue.toLocaleLowerCase()),
              )
              .map(({ label, value }) => (
                <Combobox.Item
                  key={value}
                  value={value}
                  style={{ padding: 12 }}
                >
                  {label}
                </Combobox.Item>
              ))}
          </Combobox.Content>
        </Combobox.Root>

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
        <Field.Label>Checkbox</Field.Label>

        <Checkbox />

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
        <Field.Label>Checkbox</Field.Label>

        <Switch />

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

      <Button onClick={() => setInvalid((v) => !v)} style={{ marginTop: 16 }}>
        TEST
      </Button>

      <Button
        variant="ghost"
        size="md"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        style={{ marginTop: 16, marginLeft: 8 }}
      >
        theme: {theme}
      </Button>
    </div>
  );
}

export default App;
