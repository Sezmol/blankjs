import { Button, Tooltip } from "@blankjs/react";
import { Section } from "./section";

export const TooltipSection = () => (
  <Section title="Tooltip">
    <div className="pg-row">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant="outline">Hover me</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Opens after 500ms, instant on focus.</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant="outline">Neighbor</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Instant if a sibling tooltip just closed.
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root delay={0}>
        <Tooltip.Trigger asChild>
          <Button variant="outline">No delay</Button>
        </Tooltip.Trigger>
        <Tooltip.Content placement="bottom">
          delay={"{0}"}, placed below.
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  </Section>
);
