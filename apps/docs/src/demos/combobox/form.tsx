import { useState } from "react";
import { Button, Combobox, Field, Form, serialize } from "@blankjs/react";

const cities = ["Amsterdam", "Berlin", "Lisbon", "Madrid", "Prague"];

export const ComboboxForm = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const visible = cities.filter((c) =>
    c.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <Form onSubmit={(data) => setOutput(JSON.stringify(serialize(data)))}>
      <Field.Root required errorMessages={{ valueMissing: "Pick a city" }}>
        <Field.Label>City</Field.Label>
        <Combobox.Root
          name="city"
          inputValue={input}
          onInputValueChange={setInput}
        >
          <Combobox.Input placeholder="Search" />
          <Combobox.Clear />
          <Combobox.Content>
            {visible.map((city) => (
              <Combobox.Item key={city} value={city}>
                {city}
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Root>
        <Field.Error />
      </Field.Root>

      <Button type="submit">Submit</Button>

      {output && <pre>{output}</pre>}
    </Form>
  );
};
