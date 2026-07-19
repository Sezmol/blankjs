import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { TabsBasic } from "../demos/tabs/basic";
import basicCode from "../demos/tabs/basic.tsx?raw";
import { TabsManual } from "../demos/tabs/manual";
import manualCode from "../demos/tabs/manual.tsx?raw";
import { TabsVertical } from "../demos/tabs/vertical";
import verticalCode from "../demos/tabs/vertical.tsx?raw";

export const TabsPage = () => (
  <article className="docs-page">
    <h1>Tabs</h1>

    <p className="docs-lead">
      The APG tabs pattern with two things you rarely get for free: hidden
      panels that <code>Ctrl+F</code> can still find, and a sliding active
      indicator measured off the real tabs.
    </p>

    <Demo code={basicCode}>
      <TabsBasic />
    </Demo>

    <h2>Keyboard</h2>

    <p>
      The tab list is a single Tab-stop: arrow keys move between tabs (with
      wrap-around), <code>Home</code>/<code>End</code> jump to the edges,
      disabled tabs are skipped. By default moving focus also activates the
      tab — <code>activationMode="manual"</code> decouples them, so focus
      travels and <code>Enter</code>/<code>Space</code> commits. Use manual
      when switching a panel is expensive:
    </p>

    <Demo code={manualCode}>
      <TabsManual />
    </Demo>

    <h2>Find-in-page finds hidden panels</h2>

    <p>
      Inactive panels are hidden with <code>hidden="until-found"</code>{" "}
      instead of <code>display: none</code>. In Chromium,{" "}
      <code>Ctrl+F</code> searches inside them; on a match the browser fires{" "}
      <code>beforematch</code>, and the component activates that tab — the
      user lands on the right panel with the match highlighted. Browsers
      without <code>until-found</code> treat it as plain <code>hidden</code>{" "}
      and simply lose the search bonus.
    </p>

    <p>
      One implementation confession: React renders any truthy{" "}
      <code>hidden</code> as a bare attribute, so the{" "}
      <code>"until-found"</code> value is set imperatively after render — a
      workaround for a long-standing React issue, invisible from the
      outside.
    </p>

    <h2>The sliding indicator</h2>

    <p>
      The active-tab underline is one absolutely positioned element,
      repositioned to the active tab's measured offset and size — a CSS
      transition does the sliding. A <code>ResizeObserver</code> keeps it
      honest when tabs wrap, fonts load, or labels change. The first
      placement lands without a transition, so nothing slides in from the
      corner on mount.
    </p>

    <h2>Vertical</h2>

    <Demo code={verticalCode}>
      <TabsVertical />
    </Demo>

    <h2>API</h2>

    <h3>Tabs.Root</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description: "Controlled selected tab.",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "Initially selected tab in uncontrolled mode.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Called when the selection changes.",
        },
        {
          name: "activationMode",
          type: '"automatic" | "manual"',
          defaultValue: '"automatic"',
          description:
            "Whether arrow-key focus activates a tab immediately or waits for Enter/Space.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          defaultValue: '"horizontal"',
          description:
            "Layout and arrow-key axis; sets aria-orientation on the list.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Tab size, stamped on the root.",
        },
      ]}
    />

    <h3>Tabs.Tab / Tabs.Panel</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description:
            "Pairs a tab with its panel; the ARIA wiring between them is generated from it.",
        },
      ]}
    />
  </article>
);
