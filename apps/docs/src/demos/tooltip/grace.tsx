import { Button, Tooltip } from "@blankjs/react";

const actions = ["Cut", "Copy", "Paste"];

export const TooltipGrace = () => (
  <div style={{ display: "flex", gap: "0.5rem" }}>
    {actions.map((action) => (
      <Tooltip.Root key={action}>
        <Tooltip.Trigger asChild>
          <Button variant="outline">{action}</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>{action} the selection</Tooltip.Content>
      </Tooltip.Root>
    ))}
  </div>
);
