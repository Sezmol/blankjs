import { Tabs } from "@blankjs/react";
import { Section } from "./section";

export const TabsSection = () => (
  <Section title="Tabs">
    <Tabs.Root defaultValue="preview">
      <Tabs.List>
        <Tabs.Tab value="preview">Preview</Tabs.Tab>
        <Tabs.Tab value="code">Code</Tabs.Tab>
        <Tabs.Tab value="disabled" disabled>
          Disabled
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="preview">
        Preview content. Try arrow keys, Home and End on the tabs.
      </Tabs.Panel>

      <Tabs.Panel value="code">
        Code content. Hidden panels use hidden=until-found, so Ctrl+F finds this
        text even when the tab is closed.
      </Tabs.Panel>

      <Tabs.Panel value="disabled">Unreachable</Tabs.Panel>
    </Tabs.Root>

    <Tabs.Root defaultValue="a" orientation="vertical" size="sm">
      <Tabs.List>
        <Tabs.Tab value="a">Alpha</Tabs.Tab>
        <Tabs.Tab value="b">Beta</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="a">Vertical sm: panel A</Tabs.Panel>
      <Tabs.Panel value="b">Vertical sm: panel B</Tabs.Panel>
    </Tabs.Root>
  </Section>
);
