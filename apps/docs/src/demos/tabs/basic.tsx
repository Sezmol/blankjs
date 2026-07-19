import { Tabs } from "@blankjs/react";

export const TabsBasic = () => (
  <Tabs.Root defaultValue="account">
    <Tabs.List>
      <Tabs.Tab value="account">Account</Tabs.Tab>
      <Tabs.Tab value="password">Password</Tabs.Tab>
      <Tabs.Tab value="team">Team</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="account">
      Name, avatar, and language settings live here.
    </Tabs.Panel>
    <Tabs.Panel value="password">
      Current password, new password, confirmation.
    </Tabs.Panel>
    <Tabs.Panel value="team">Invite teammates and manage roles.</Tabs.Panel>
  </Tabs.Root>
);
