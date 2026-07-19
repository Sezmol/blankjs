import { Field, Slider } from "@blankjs/react";

export const SliderStep = () => (
  <>
    <Field.Root>
      <Field.Label>Steps of 10</Field.Label>
      <Slider defaultValue={30} step={10} />
    </Field.Root>

    <Field.Root>
      <Field.Label>Range 0–1000</Field.Label>
      <Slider defaultValue={250} min={0} max={1000} size="lg" />
    </Field.Root>

    <Field.Root disabled>
      <Field.Label>Disabled</Field.Label>
      <Slider defaultValue={60} />
    </Field.Root>
  </>
);
