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
      The APG tabs pattern plus two extras: <code>Ctrl+F</code> finds text in
      hidden panels, and an active indicator slides between the measured
      tabs.
    </p>

    <Demo code={basicCode}>
      <TabsBasic />
    </Demo>

    <h2>Keyboard</h2>

    <p>
      The tab list is a single Tab stop. Arrow keys move between tabs and
      wrap around, <code>Home</code>/<code>End</code> jump to the edges, and
      focus skips disabled tabs. By default moving focus also activates the
      tab. <code>activationMode="manual"</code> separates the two: focus
      moves, and <code>Enter</code>/<code>Space</code> activates. Use manual
      when switching a panel is expensive:
    </p>

    <Demo code={manualCode}>
      <TabsManual />
    </Demo>

    <h2>Find-in-page finds hidden panels</h2>

    <p>
      Tabs hides inactive panels with <code>hidden="until-found"</code> in
      place of <code>display: none</code>. In Chromium, <code>Ctrl+F</code>{" "}
      searches inside them. On a match the browser fires{" "}
      <code>beforematch</code>, Tabs activates that tab, and the user lands
      on the right panel with the match highlighted. Browsers without{" "}
      <code>until-found</code> treat it as plain <code>hidden</code>, and
      search skips the hidden panels.
    </p>

    <p>
      React renders any truthy <code>hidden</code> as a bare attribute, so
      Tabs sets the <code>"until-found"</code> value imperatively after
      render. This works around a long-standing React issue and changes
      nothing for you.
    </p>

    <h2>The sliding indicator</h2>

    <p>
      The active-tab underline is one absolutely positioned element. Tabs
      moves it to the active tab's measured offset and size, and a CSS
      transition animates the move. A <code>ResizeObserver</code> measures
      again when tabs wrap, fonts load, or labels change. The first
      placement skips the transition, so nothing slides in from the corner
      on mount.
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
