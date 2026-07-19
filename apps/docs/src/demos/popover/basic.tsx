import { Button, Popover } from "@blankjs/react";

export const PopoverBasic = () => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <Button variant="outline">Show details</Button>
    </Popover.Trigger>

    <Popover.Content>
      Click outside or press Escape to dismiss — the browser handles both.
    </Popover.Content>
  </Popover.Root>
);
