import { useState } from "react";
import { Button, Popover } from "@blankjs/react";
import { Section } from "./section";

export const PopoverSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <Section title="Popover">
      <div className="pg-row">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="outline">Basic</Button>
          </Popover.Trigger>
          <Popover.Content>
            Light dismiss, Escape and top layer — all from the browser.
          </Popover.Content>
        </Popover.Root>

        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="outline">Top-end</Button>
          </Popover.Trigger>
          <Popover.Content placement="top-end">
            Placed above, aligned to the end.
            <Popover.Close asChild>
              <Button size="sm" variant="outline">
                Close
              </Button>
            </Popover.Close>
          </Popover.Content>
        </Popover.Root>

        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button variant="outline">
              Controlled ({open ? "open" : "closed"})
            </Button>
          </Popover.Trigger>
          <Popover.Content>State lives in React.</Popover.Content>
        </Popover.Root>
      </div>
    </Section>
  );
};
