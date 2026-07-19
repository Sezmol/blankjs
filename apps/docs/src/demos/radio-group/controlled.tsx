import { useState } from "react";
import { Field, RadioGroup } from "@blankjs/react";

export const RadioGroupControlled = () => {
  const [plan, setPlan] = useState("free");

  return (
    <Field.Root>
      <Field.Label>Plan: {plan}</Field.Label>
      <RadioGroup.Root name="plan" value={plan} onValueChange={setPlan}>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
        <RadioGroup.Item value="team">Team</RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>
  );
};
