import { Button, TextInput } from "@blankjs/react";
import { Section } from "./section";

export const TailwindSection = () => (
  <Section title="Tailwind override">
    <div className="pg-row">
      <Button>untouched</Button>
      <Button className="bg-red-500 text-white">bg-red-500</Button>
      <Button variant="outline" className="rounded-none border-emerald-500">
        rounded-none
      </Button>
    </div>

    <div className="pg-row">
      <TextInput placeholder="untouched" />
      <TextInput className="rounded-full border-2 border-amber-500" placeholder="rounded-full" />
    </div>
  </Section>
);
