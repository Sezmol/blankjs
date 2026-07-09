import { Button } from "@blankjs/react";
import { Section } from "./section";

export const ButtonSection = () => (
  <Section title="Button">
    <div className="pg-row">
      <Button>Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
    <div className="pg-row">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
    <div className="pg-row">
      <Button disabled>Disabled</Button>
      <Button asChild variant="outline">
        <a href="#top">Link as button</a>
      </Button>
    </div>
  </Section>
);
