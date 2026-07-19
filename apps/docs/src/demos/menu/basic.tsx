import { useState } from "react";
import { Button, Menu } from "@blankjs/react";

export const MenuBasic = () => {
  const [last, setLast] = useState("nothing yet");

  return (
    <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="outline">Actions</Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item onClick={() => setLast("Rename")}>Rename</Menu.Item>
          <Menu.Item onClick={() => setLast("Duplicate")}>Duplicate</Menu.Item>
          <Menu.Item disabled>Share (soon)</Menu.Item>
          <Menu.Item onClick={() => setLast("Delete")}>Delete</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <output>Last action: {last}</output>
    </div>
  );
};
