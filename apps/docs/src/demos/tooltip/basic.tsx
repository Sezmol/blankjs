import { Button, Tooltip } from "@blankjs/react";

export const TooltipBasic = () => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Button variant="outline">Hover or focus me</Button>
    </Tooltip.Trigger>
    <Tooltip.Content>Saves the current file</Tooltip.Content>
  </Tooltip.Root>
);
