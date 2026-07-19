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
      <Popover.Content>Nested just works.</Popover.Content>
    </Popover.Root>
  </Popover.Content>
</Popover.Root>
`;

export const PopoverPage = () => (
  <article className="docs-page">
    <h1>Popover</h1>

    <p className="docs-lead">
      A non-modal floating panel built on the native Popover API. Opening,
      light dismiss, <code>Escape</code>, and the top layer come from the
      browser; the library only positions the panel next to its trigger.
    </p>

    <Demo code={basicCode}>
      <PopoverBasic />
    </Demo>

    <h2>Built on the platform</h2>

    <p>
      <code>Popover.Content</code> renders a <code>div popover="auto"</code>{" "}
      and <code>Popover.Trigger</code> points at it with{" "}
      <code>popovertarget</code>. That pair of attributes buys, with zero
      JavaScript on our side:
    </p>

    <ul className="docs-list">
      <li>
        <strong>Opening and closing.</strong> The trigger toggles the popover
        natively — it works before React hydrates.
      </li>
      <li>
        <strong>Top layer.</strong> The panel paints above everything and no
        ancestor <code>overflow: hidden</code> can clip it — so there is no
        portal, and the content stays where you wrote it in the tree.
      </li>
      <li>
        <strong>Light dismiss and Escape.</strong> Clicking outside or
        pressing <code>Escape</code> closes the popover — the browser tells
        the library through the <code>toggle</code> event, so controlled
        state never drifts.
      </li>
      <li>
        <strong>ARIA.</strong> The browser sets <code>aria-expanded</code> on
        the trigger itself.
      </li>
    </ul>

    <p>
      Positioning is the one thing the platform does not cover yet — CSS
      anchor positioning is not cross-browser — so the library measures the
      trigger and places the panel with floating-ui, the same engine behind{" "}
      <Link to="/components/select">Select</Link>.
    </p>

    <h2>Anatomy</h2>

    <CodeBlock code={anatomyCode} />

    <p>
      <code>Popover.Trigger</code> and <code>Popover.Close</code> render
      buttons; both take <code>asChild</code> to merge their behavior onto
      your own element, typically a <code>Button</code>.{" "}
      <code>Popover.Close</code> closes through{" "}
      <code>popovertargetaction="hide"</code> — native, no handler.
    </p>

    <h2>Placement</h2>

    <p>
      <code>placement</code> on <code>Popover.Content</code> picks the side
      and alignment. The panel flips to the opposite side automatically when
      it would overflow the viewport.
    </p>

    <Demo code={placementCode}>
      <PopoverPlacement />
    </Demo>

    <h2>Controlled</h2>

    <p>
      Pass <code>open</code> and <code>onOpenChange</code> to own the state.
      The browser can still close the popover on its own — light dismiss,{" "}
      <code>Escape</code> — and every native close is reported back, so your
      state and the screen never disagree.
    </p>

    <Demo code={controlledCode}>
      <PopoverControlled />
    </Demo>

    <h2>Nesting</h2>

    <p>
      Because the content is never portaled, a nested popover is a real DOM
      descendant of its parent — and the Popover API keeps ancestor popovers
      open automatically. <code>Escape</code> closes only the topmost one.
    </p>

    <CodeBlock code={nestedCode} />

    <p>
      One combination to avoid: a modal <code>Dialog</code> opened from
      inside a popover — <code>showModal()</code> makes the rest of the page
      inert and the browser closes every open popover. Open the dialog as a
      sibling instead.
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
      125+, Safari 17+). There is no fallback for older browsers — that is a
      deliberate trade: no portal, no focus management code, no dismiss
      listeners to maintain.
    </p>
  </article>
);
