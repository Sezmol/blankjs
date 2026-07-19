import { Tabs } from "@blankjs/react";

export const TabsManual = () => (
  <Tabs.Root defaultValue="overview" activationMode="manual">
    <Tabs.List>
      <Tabs.Tab value="overview">Overview</Tabs.Tab>
      <Tabs.Tab value="analytics">Analytics (heavy)</Tabs.Tab>
      <Tabs.Tab value="exports">Exports</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="overview">
      Arrow keys only move focus here — press Enter or Space to switch.
    </Tabs.Panel>
    <Tabs.Panel value="analytics">
      Imagine an expensive chart that should not render while the user is
      just passing through with the keyboard.
    </Tabs.Panel>
    <Tabs.Panel value="exports">CSV, JSON, and PDF exports.</Tabs.Panel>
  </Tabs.Root>
);
