import { Accordion } from "@blankjs/react";

export const AccordionBasic = () => (
  <Accordion.Root>
    <Accordion.Item defaultOpen>
      <Accordion.Trigger>What is blankjs?</Accordion.Trigger>
      <Accordion.Content>
        A form-first React UI kit that leans on the platform instead of
        re-implementing it.
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item>
      <Accordion.Trigger>Is this accordion native?</Accordion.Trigger>
      <Accordion.Content>
        Yes — each item is a real details element with a summary trigger.
        Toggling and keyboard support come from the browser.
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item>
      <Accordion.Trigger>Can several items stay open?</Accordion.Trigger>
      <Accordion.Content>
        By default, yes. Add the exclusive prop to keep at most one open.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);
