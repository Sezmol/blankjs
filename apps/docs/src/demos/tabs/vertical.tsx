import { Tabs } from "@blankjs/react";

export const TabsVertical = () => (
  <Tabs.Root defaultValue="general" orientation="vertical">
    <Tabs.List>
      <Tabs.Tab value="general">General</Tabs.Tab>
      <Tabs.Tab value="appearance">Appearance</Tabs.Tab>
      <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="general">Arrow Up and Down move between tabs.</Tabs.Panel>
    <Tabs.Panel value="appearance">Theme and density.</Tabs.Panel>
    <Tabs.Panel value="advanced">Danger zone.</Tabs.Panel>
  </Tabs.Root>
);
