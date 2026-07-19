import { Button, Menu } from "@blankjs/react";
import { Section } from "./section";

export const MenuSection = () => (
  <Section title="Menu">
    <div className="pg-row">
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="outline">Actions</Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item onClick={() => console.log("rename")}>Rename</Menu.Item>
          <Menu.Item onClick={() => console.log("duplicate")}>
            Duplicate
          </Menu.Item>
          <Menu.Item disabled>Share (soon)</Menu.Item>
          <Menu.Item onClick={() => console.log("delete")}>Delete</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="outline">Top placement</Button>
        </Menu.Trigger>
        <Menu.Content placement="top-start">
          <Menu.Item>First</Menu.Item>
          <Menu.Item>Second</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  </Section>
);
