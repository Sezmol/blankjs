import { useState } from "react";
import { Button, Popover } from "@blankjs/react";

export const PopoverControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline">{open ? "Open" : "Closed"} — click me</Button>
      </Popover.Trigger>

      <Popover.Content>
        Light dismiss and Escape still work: the browser closes the popover
        and <code>onOpenChange</code> keeps your state in sync.
        <Popover.Close asChild>
          <Button size="sm" variant="outline">
            Close
          </Button>
        </Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
};
