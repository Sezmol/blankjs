import { Accordion } from "@blankjs/react";

export const AccordionExclusive = () => (
  <Accordion.Root exclusive>
    <Accordion.Item defaultOpen>
      <Accordion.Trigger>Shipping</Accordion.Trigger>
      <Accordion.Content>
        Orders ship within two business days.
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item>
      <Accordion.Trigger>Returns</Accordion.Trigger>
      <Accordion.Content>
        Thirty days, no questions asked. Opening this closes the others —
        the browser enforces it, not an effect.
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item>
      <Accordion.Trigger>Warranty</Accordion.Trigger>
      <Accordion.Content>Two years on every product.</Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);
