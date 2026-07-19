import { Button, Tooltip } from "@blankjs/react";

export const TooltipDelay = () => (
  <div style={{ display: "flex", gap: "0.5rem" }}>
    <Tooltip.Root delay={0}>
      <Tooltip.Trigger asChild>
        <Button variant="outline">No delay</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Shows immediately</Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root delay={1000}>
      <Tooltip.Trigger asChild>
        <Button variant="outline">Slow</Button>
      </Tooltip.Trigger>
      <Tooltip.Content placement="bottom">
        A full second, placed below
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
);
