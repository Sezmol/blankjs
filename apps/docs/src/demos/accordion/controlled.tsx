import { useState } from "react";
import { Accordion, Button } from "@blankjs/react";

export const AccordionControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "grid", gap: "0.75rem", width: "100%" }}>
      <Button
        variant="outline"
        style={{ justifySelf: "start" }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Open"} from outside
      </Button>

      <Accordion.Root>
        <Accordion.Item open={open} onOpenChange={setOpen}>
          <Accordion.Trigger>Controlled item</Accordion.Trigger>
          <Accordion.Content>
            The open prop owns this item; clicks report through onOpenChange.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};
