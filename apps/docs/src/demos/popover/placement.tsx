import { Button, Popover } from "@blankjs/react";

const placements = ["top", "right", "bottom-end", "left-start"] as const;

export const PopoverPlacement = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
    {placements.map((placement) => (
      <Popover.Root key={placement}>
        <Popover.Trigger asChild>
          <Button variant="outline" size="sm">
            {placement}
          </Button>
        </Popover.Trigger>

        <Popover.Content placement={placement}>
          placement="{placement}"
        </Popover.Content>
      </Popover.Root>
    ))}
  </div>
);
