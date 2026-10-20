import { useState } from "react";
import { CheckboxGroup, Field } from "@blankjs/react";

export const CheckboxGroupControlled = () => {
  const [days, setDays] = useState<string[]>(["mon"]);

  return (
    <Field.Root>
      <Field.Label>Days: {days.join(", ") || "none"}</Field.Label>
      <CheckboxGroup.Root name="days" value={days} onValueChange={setDays}>
        <CheckboxGroup.Item value="mon">Monday</CheckboxGroup.Item>
        <CheckboxGroup.Item value="wed">Wednesday</CheckboxGroup.Item>
        <CheckboxGroup.Item value="fri">Friday</CheckboxGroup.Item>
      </CheckboxGroup.Root>
    </Field.Root>
  );
};
