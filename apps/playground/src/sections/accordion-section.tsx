import { Accordion } from "@blankjs/react";
import { Section } from "./section";

export const AccordionSection = () => (
  <Section title="Accordion">
    <Accordion.Root exclusive>
      <Accordion.Item defaultOpen>
        <Accordion.Trigger>Is it native?</Accordion.Trigger>

        <Accordion.Content>
          Yes - details and summary. Exclusivity comes from the native name
          attribute, zero JS.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item>
        <Accordion.Trigger>Does Ctrl+F work?</Accordion.Trigger>

        <Accordion.Content>
          In Chromium, find-in-page searches closed items and opens them
          automatically.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item>
        <Accordion.Trigger>Is it animated?</Accordion.Trigger>

        <Accordion.Content>
          Height animates via interpolate-size and ::details-content where the
          browser supports it, and degrades to instant elsewhere.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </Section>
);
