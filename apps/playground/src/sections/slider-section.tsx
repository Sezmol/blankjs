import { useState } from "react";
import { Button, Field, Form, serialize, Slider } from "@blankjs/react";
import { Section } from "./section";

export const SliderSection = () => {
  const [volume, setVolume] = useState(40);

  return (
    <Section title="Slider">
      <Field.Root>
        <Field.Label>Volume: {volume}</Field.Label>
        <Slider
          value={volume}
          onChange={(e) => setVolume(Number(e.currentTarget.value))}
          min={0}
          max={1000}
          size="lg"
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Steps of 10</Field.Label>
        <Slider defaultValue={30} step={10} size="sm" />
      </Field.Root>

      <Field.Root>
        <Field.Label>Disabled</Field.Label>
        <Slider defaultValue={60} disabled />
      </Field.Root>

      <Form
        onSubmit={(fd) => {
          console.log(serialize(fd));
        }}
      >
        <Field.Root>
          <Field.Label>In a form (name="brightness")</Field.Label>

          <Slider name="brightness" defaultValue={75} />
        </Field.Root>

        <Button type="submit">Read FormData</Button>
        <Button type="reset">Reset</Button>
      </Form>
    </Section>
  );
};
