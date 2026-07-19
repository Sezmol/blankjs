import { useState } from "react";
import { Button, Menu } from "@blankjs/react";

export const MenuControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Menu.Trigger asChild>
        <Button variant="outline">Menu ({open ? "open" : "closed"})</Button>
      </Menu.Trigger>
      <Menu.Content placement="bottom-end">
        <Menu.Item>First</Menu.Item>
        <Menu.Item>Second</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};
