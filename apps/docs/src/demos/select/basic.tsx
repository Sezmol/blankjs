import { Select } from "@blankjs/react";

const fruits: Record<string, string> = {
  apple: "Apple",
  banana: "Banana",
  cherry: "Cherry",
};

export const SelectBasic = () => (
  <Select.Root name="fruit" defaultValue="apple">
    <Select.Trigger>
      <Select.Value placeholder="Pick a fruit">
        {(value) => fruits[value]}
      </Select.Value>
    </Select.Trigger>

    <Select.Clear />

    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
      <Select.Item value="cherry">Cherry</Select.Item>
    </Select.Content>
  </Select.Root>
);
