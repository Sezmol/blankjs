import { useState } from "react";
import { Combobox, Field } from "@blankjs/react";

const fruits = ["Apple", "Banana", "Cherry", "Grape", "Mango", "Peach"];

export const ComboboxBasic = () => {
  const [input, setInput] = useState("");

  const visible = fruits.filter((f) =>
    f.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <Field.Root>
      <Field.Label>Fruit</Field.Label>
      <Combobox.Root inputValue={input} onInputValueChange={setInput}>
        <Combobox.Input placeholder="Search fruits" />
        <Combobox.Content>
          {visible.map((fruit) => (
            <Combobox.Item key={fruit} value={fruit}>
              {fruit}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Root>
    </Field.Root>
  );
};
