import { useState } from "react";
import { Checkbox, Field } from "@blankjs/react";
import { Section } from "./section";

const IndeterminateDemo = () => {
  const [items, setItems] = useState([true, false]);

  const checkedCount = items.filter(Boolean).length;
  const allChecked = checkedCount === items.length;
  const someChecked = checkedCount > 0 && !allChecked;

  return (
    <div className="pg-field">
      <label className="pg-inline">
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={(checked) => setItems(items.map(() => checked))}
        />
        Select all
      </label>
      {items.map((checked, i) => (
        <label key={i} className="pg-inline pg-indent">
          <Checkbox
            checked={checked}
            onCheckedChange={(next) =>
              setItems(items.map((v, j) => (j === i ? next : v)))
            }
          />
          Item {i + 1}
        </label>
      ))}
    </div>
  );
};

export const CheckboxSection = () => (
  <Section title="Checkbox">
    <Field.Root className="pg-inline">
      <Checkbox defaultChecked />
      <Field.Label>Accept terms</Field.Label>
    </Field.Root>

    <Field.Root invalid className="pg-inline">
      <Checkbox />
      <Field.Label>Required consent</Field.Label>
    </Field.Root>

    <Field.Root disabled className="pg-inline">
      <Checkbox defaultChecked />
      <Field.Label>Disabled</Field.Label>
    </Field.Root>

    <IndeterminateDemo />
  </Section>
);
