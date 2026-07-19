import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { TooltipBasic } from "../demos/tooltip/basic";
import basicCode from "../demos/tooltip/basic.tsx?raw";
import { TooltipDelay } from "../demos/tooltip/delay";
import delayCode from "../demos/tooltip/delay.tsx?raw";
import { TooltipGrace } from "../demos/tooltip/grace";
import graceCode from "../demos/tooltip/grace.tsx?raw";

const anatomyCode = `
<Tooltip.Root>
  <Tooltip.Trigger asChild>
    <Button>Save</Button>
  </Tooltip.Trigger>

  <Tooltip.Content>Saves the current file</Tooltip.Content>
</Tooltip.Root>
`;

const disabledCode = `
<Tooltip.Trigger asChild>
  <span tabIndex={0}>
    <Button disabled>Save</Button>
  </span>
</Tooltip.Trigger>
`;

export const TooltipPage = () => (
  <article className="docs-page">
    <h1>Tooltip</h1>

    <p className="docs-lead">
      A hover and focus label built on the native{" "}
      <code>popover="hint"</code>. The browser provides the top layer and
      keeps hints out of the way of open popovers; the library contributes
      what tooltips are really about — timing.
    </p>

    <Demo code={basicCode}>
      <TooltipBasic />
    </Demo>

    <h2>Timing is the component</h2>

    <p>
      A naive tooltip — show on enter, hide on leave — fails the moment a
      cursor travels across a toolbar: every button it crosses flashes a
      label nobody asked for. Everything this component adds is an answer to
      one question: <em>was that intentional?</em>
    </p>

    <ul className="docs-list">
      <li>
        <strong>Open delay.</strong> Hover opens after 500ms. A cursor
        passing through never rests that long; a cursor that stops does.
      </li>
      <li>
        <strong>Close delay.</strong> Leaving the trigger closes 100ms later
        — enough time to move the pointer onto the tooltip itself, so its
        text can be selected and copied (WCAG 1.4.13). Hovering the content
        cancels the close.
      </li>
      <li>
        <strong>Grace period.</strong> Once a tooltip has just closed,
        neighboring ones open with no delay — pay the 500ms once, then read
        labels as fast as you can point. Try sweeping across the row:
      </li>
    </ul>

    <Demo code={graceCode}>
      <TooltipGrace />
    </Demo>

    <p>
      The grace window is shared by every tooltip on the page without a
      provider to wrap your app in — it is a single timestamp, not state, so
      no context is needed.
    </p>

    <p>
      Keyboard focus skips the delay entirely: tabbing to a control is
      always intentional, so the tooltip shows at once. Mouse clicks also
      focus the trigger, but do not show the tooltip —{" "}
      <code>:focus-visible</code> tells the two apart. <code>Escape</code>{" "}
      dismisses without moving focus. On touch there are no tooltips at all
      — there is no hover to explain, and a tap already means "activate".
    </p>

    <h2>Anatomy</h2>

    <CodeBlock code={anatomyCode} />

    <p>
      <code>Tooltip.Trigger</code> renders a button and links itself to the
      content with <code>aria-describedby</code>, so screen readers announce
      the label with the control. Unlike{" "}
      <Link to="/components/popover">Popover</Link>, there is no{" "}
      <code>popovertarget</code> wiring — a click on the trigger must mean
      the button's own action, never "toggle the tooltip". Visibility
      belongs to hover and focus alone.
    </p>

    <h2>Why popover="hint"</h2>

    <p>
      <code>Tooltip.Content</code> renders a{" "}
      <code>div popover="hint" role="tooltip"</code>. The hint state exists
      exactly for this: it lives in the top layer (no z-index, no clipping,
      no portal) but stays <em>outside</em> the light-dismiss stack of{" "}
      <code>auto</code> popovers. Hovering a tooltip while a{" "}
      <Link to="/components/popover">Popover</Link> or{" "}
      <Link to="/components/select">Select</Link> is open does not close
      them — with <code>auto</code> it would.
    </p>

    <p>
      In browsers that do not know <code>hint</code> yet (Safari), the
      attribute degrades to the <code>manual</code> state by spec: still top
      layer, still <code>showPopover()</code> — only the hint semantics are
      gone, and those the library never relied on, since visibility is
      driven by its own timers.
    </p>

    <h2>Disabled triggers</h2>

    <p>
      Disabled elements fire no pointer events, so a tooltip on a disabled
      button never opens. That is a platform rule, not a library one; the
      escape hatch is a focusable wrapper:
    </p>

    <CodeBlock code={disabledCode} />

    <h2>Delay and placement</h2>

    <Demo code={delayCode}>
      <TooltipDelay />
    </Demo>

    <h2>API</h2>

    <h3>Tooltip.Root</h3>

    <PropsTable
      props={[
        {
          name: "delay",
          type: "number",
          defaultValue: "500",
          description:
            "Milliseconds a hover must last before the tooltip opens. Focus ignores it.",
        },
        {
          name: "open",
          type: "boolean",
          description: "Controlled open state.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          defaultValue: "false",
          description: "Whether the tooltip starts open in uncontrolled mode.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Called on every open and close.",
        },
      ]}
    />

    <h3>Tooltip.Trigger</h3>

    <PropsTable
      props={[
        {
          name: "asChild",
          type: "boolean",
          defaultValue: "false",
          description:
            "Renders the child element instead of the built-in button, merging tooltip behavior onto it.",
        },
      ]}
    />

    <h3>Tooltip.Content</h3>

    <PropsTable
      props={[
        {
          name: "placement",
          type: "Placement",
          defaultValue: '"top"',
          description:
            "Side and alignment relative to the trigger; flips automatically at viewport edges.",
        },
      ]}
    />

    <h2>Browser support</h2>

    <p>
      <code>popover="hint"</code> ships in Chrome 133+ and Firefox 149+ and
      degrades to <code>manual</code> elsewhere — the tooltip works the same
      either way. The fade-in uses <code>@starting-style</code>; browsers
      without it simply show the tooltip instantly.
    </p>
  </article>
);
