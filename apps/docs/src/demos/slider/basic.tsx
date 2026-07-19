import { useState } from "react";
import { Field, Slider } from "@blankjs/react";

export const SliderBasic = () => {
  const [volume, setVolume] = useState(40);

  return (
    <Field.Root>
      <Field.Label>Volume: {volume}</Field.Label>
      <Slider
        value={volume}
        onChange={(e) => setVolume(Number(e.currentTarget.value))}
      />
    </Field.Root>
  );
};
