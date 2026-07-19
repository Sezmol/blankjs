import { Field, MultiSelect } from "@blankjs/react";

const tags = ["Design", "Frontend", "Backend", "DevOps", "Docs"];

export const MultiSelectBasic = () => (
  <Field.Root>
    <Field.Label>Topics</Field.Label>
    <MultiSelect.Root defaultValue={["Frontend"]}>
      <MultiSelect.Trigger>
        <MultiSelect.Value placeholder="Pick a few">
          {(values) => values.join(", ")}
        </MultiSelect.Value>
      </MultiSelect.Trigger>
      <MultiSelect.Content>
        {tags.map((tag) => (
          <MultiSelect.Item key={tag} value={tag}>
            {tag}
          </MultiSelect.Item>
        ))}
      </MultiSelect.Content>
    </MultiSelect.Root>
  </Field.Root>
);
