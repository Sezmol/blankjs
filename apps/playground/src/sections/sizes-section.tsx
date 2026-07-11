import { Button, Checkbox, Select, Switch, TextInput } from "@blankjs/react";
import { Section } from "./section";

const sizes = ["sm", "md", "lg"] as const;

export const SizesSection = () => (
  <Section title="Sizes" className="pg-card-wide">
    {sizes.map((size) => (
      <div className="pg-size-row" key={size}>
        <span className="pg-size-label">{size}</span>

        <Button size={size}>Button</Button>

        <TextInput size={size} placeholder="Input" aria-label={`Input ${size}`} />

        <Select.Root size={size}>
          <Select.Trigger aria-label={`Select ${size}`}>
            <Select.Value placeholder="Select" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">Option A</Select.Item>
            <Select.Item value="b">Option B</Select.Item>
          </Select.Content>
        </Select.Root>

        <Checkbox size={size} aria-label={`Checkbox ${size}`} defaultChecked />

        <Switch size={size} aria-label={`Switch ${size}`} defaultChecked />
      </div>
    ))}
  </Section>
);
