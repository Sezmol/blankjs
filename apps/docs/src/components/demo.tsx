import type { ReactNode } from "react";
import { Tabs } from "@blankjs/react";
import { CodeBlock } from "./code-block";

type DemoProps = {
  code: string;
  children: ReactNode;
};

export const Demo = ({ code, children }: DemoProps) => (
  <div className="docs-demo">
    <Tabs.Root defaultValue="preview" size="sm">
      <Tabs.List>
        <Tabs.Tab value="preview">Preview</Tabs.Tab>
        <Tabs.Tab value="code">Code</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="preview">
        <div className="docs-demo-preview">{children}</div>
      </Tabs.Panel>

      <Tabs.Panel value="code">
        <CodeBlock code={code} />
      </Tabs.Panel>
    </Tabs.Root>
  </div>
);
