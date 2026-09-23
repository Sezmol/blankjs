import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { PopoverBasic } from "../demos/popover/basic";
import basicCode from "../demos/popover/basic.tsx?raw";
import { PopoverControlled } from "../demos/popover/controlled";
import controlledCode from "../demos/popover/controlled.tsx?raw";
import { PopoverPlacement } from "../demos/popover/placement";
import placementCode from "../demos/popover/placement.tsx?raw";

const anatomyCode = `
<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>

  <Popover.Content>
    …
    <Popover.Close>Close</Popover.Close>
  </Popover.Content>
</Popover.Root>
`;

const nestedCode = `
<Popover.Root>
  <Popover.Trigger>Filters</Popover.Trigger>
  <Popover.Content>
    <Popover.Root>
      <Popover.Trigger>Advanced…</Popover.Trigger>
      <Popover.Content>Nested popover</Popover.Content>
    </Popover.Root>
  </Popover.Content>
</Popover.Root>
`;

export const PopoverPage = () => (
  <article className="docs-page">
    <h1>Popover</h1>

    <p className="docs-lead">
      A non-modal floating panel built on the native Popover API. The browser
      handles opening, light dismiss, <code>Escape</code>, and the top layer.
      The library positions the panel next to its trigger.
    </p>

    <Demo code={basicCode}>
      <PopoverBasic />
    </Demo>

    <h2>Built on the platform</h2>

    <p>
      <code>Popover.Content</code> renders a <code>div popover="auto"</code>{" "}
      and <code>Popover.Trigger</code> points at it with{" "}
      <code>popovertarget</code>. These two attributes give you the following
      without any JavaScript on our side:
    </p>

    <ul className="docs-list">
      <li>
        <strong>Opening and closing.</strong> The trigger toggles the popover
        natively, so it works before React hydrates.
      </li>
      <li>
        <strong>Top layer.</strong> The panel paints above the page, and no
        ancestor <code>overflow: hidden</code> can clip it. It needs no portal
        and stays where you wrote it in the tree.
      </li>
      <li>
        <strong>Light dismiss and Escape.</strong> Clicking outside or
        pressing <code>Escape</code> closes the popover. The browser reports it
        through the <code>toggle</code> event, and Popover passes it on to{" "}
        <code>onOpenChange</code>.
      </li>
      <li>
        <strong>ARIA.</strong> The browser sets <code>aria-expanded</code> on
        the trigger itself.
      </li>
    </ul>

    <p>
      The platform does not cover positioning yet, because CSS anchor
      positioning is not cross-browser. The library measures the trigger and
      places the panel with floating-ui, the same engine behind{" "}
      <Link to="/components/select">Select</Link>.
    </p>

    <h2>Anatomy</h2>

    <CodeBlock code={anatomyCode} />

    <p>
      <code>Popover.Trigger</code> and <code>Popover.Close</code> render
      buttons; both take <code>asChild</code> to merge their behavior onto
      your own element, typically a <code>Button</code>.{" "}
      <code>Popover.Close</code> closes through the native{" "}
      <code>popovertargetaction="hide"</code>, with no handler.
    </p>

    <h2>Placement</h2>

    <p>
      <code>placement</code> on <code>Popover.Content</code> picks the side
      and alignment. The panel flips to the opposite side when it would
      overflow the viewport.
    </p>

    <Demo code={placementCode}>
      <PopoverPlacement />
    </Demo>

    <h2>Controlled</h2>

    <p>
      Pass <code>open</code> and <code>onOpenChange</code> to own the state.
      The browser can still close the popover by itself on light dismiss or{" "}
      <code>Escape</code>, and Popover reports every such close through{" "}
      <code>onOpenChange(false)</code>. Update your state from it: if you
      ignore it, the popover stays closed while your state says open.
    </p>

    <Demo code={controlledCode}>
      <PopoverControlled />
    </Demo>

    <h2>Nesting</h2>

    <p>
      Popover never portals its content, so a nested popover is a real DOM
      descendant of its parent, and the Popover API keeps ancestor popovers
      open. <code>Escape</code> closes only the topmost one.
    </p>

    <CodeBlock code={nestedCode} />

    <p>
      Avoid opening a modal <code>Dialog</code> from inside a popover:{" "}
      <code>showModal()</code> makes the rest of the page inert, and the
      browser closes every open popover. Open the dialog as a sibling
      instead.
    </p>

    <h2>API</h2>

    <h3>Popover.Root</h3>

    <PropsTable
      props={[
        {
          name: "open",
          type: "boolean",
          description: "Controlled open state.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          defaultValue: "false",
          description: "Whether the popover starts open in uncontrolled mode.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description:
            "Called on every open and close, including browser-initiated ones.",
        },
      ]}
    />

    <h3>Popover.Content</h3>

    <PropsTable
      props={[
        {
          name: "placement",
          type: "Placement",
          defaultValue: '"bottom-start"',
          description:
            'Side and alignment relative to the trigger: "top", "bottom-end", "left-start", and the rest of the floating-ui placements.',
        },
      ]}
    />

    <p>
      Also accepts every native <code>div</code> prop.{" "}
      <code>preventDefault()</code> in <code>onToggle</code> keeps a
      browser-initiated state change out of React state.
    </p>

    <h3>Popover.Trigger / Popover.Close</h3>

    <PropsTable
      props={[
        {
          name: "asChild",
          type: "boolean",
          defaultValue: "false",
          description:
            "Renders the child element instead of the built-in button, merging popover props onto it.",
        },
      ]}
    />

    <h2>Browser support</h2>

    <p>
      The Popover API ships in every evergreen browser (Chrome 114+, Firefox
      125+, Safari 17+). Older browsers get no fallback. In exchange the
      library has no portal, no focus management code, and no dismiss
      listeners to maintain.
    </p>
  </article>
);
