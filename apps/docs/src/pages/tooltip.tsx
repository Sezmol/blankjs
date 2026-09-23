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
      keeps hints out of the way of open popovers. The library handles the
      timing.
    </p>

    <Demo code={basicCode}>
      <TooltipBasic />
    </Demo>

    <h2>Timing</h2>

    <p>
      A tooltip that shows on enter and hides on leave misbehaves when the
      cursor crosses a toolbar: every button along the way flashes a label.
      Tooltip adds three rules that tell a deliberate hover from a passing
      one:
    </p>

    <ul className="docs-list">
      <li>
        <strong>Open delay.</strong> Hover opens the tooltip after 500ms. A
        passing cursor does not rest that long, and a cursor that stops does.
      </li>
      <li>
        <strong>Close delay.</strong> Leaving the trigger closes the tooltip
        100ms later. That gives the user time to move the pointer onto the
        tooltip and select or copy its text (WCAG 1.4.13). Hovering the
        content cancels the close.
      </li>
      <li>
        <strong>Grace period.</strong> Right after a tooltip closes,
        neighboring ones open with no delay. The user waits 500ms once, then
        reads labels as fast as they can point. Try sweeping across the row:
      </li>
    </ul>

    <Demo code={graceCode}>
      <TooltipGrace />
    </Demo>

    <p>
      Every tooltip on the page shares the grace window without a provider
      around your app. The window is one shared timestamp outside React
      state, so it needs no context.
    </p>

    <p>
      Keyboard focus skips the delay: tabbing to a control is a deliberate
      move, so the tooltip shows at once. A mouse click also focuses the
      trigger but does not show the tooltip; <code>:focus-visible</code>{" "}
      tells the two apart. <code>Escape</code> dismisses the tooltip without
      moving focus. Touch devices get no tooltips: there is no hover, and a
      tap already means "activate".
    </p>

    <h2>Anatomy</h2>

    <CodeBlock code={anatomyCode} />

    <p>
      <code>Tooltip.Trigger</code> renders a button and links itself to the
      content with <code>aria-describedby</code>, so screen readers announce
      the label with the control. Unlike{" "}
      <Link to="/components/popover">Popover</Link>, the trigger has no{" "}
      <code>popovertarget</code>: a click on it runs the button's own action
      and never toggles the tooltip. Only hover and focus show it.
    </p>

    <h2>popover="hint"</h2>

    <p>
      <code>Tooltip.Content</code> renders a{" "}
      <code>div popover="hint" role="tooltip"</code>. The hint state lives in
      the top layer (no z-index, no clipping, no portal) and stays{" "}
      <em>outside</em> the light-dismiss stack of <code>auto</code> popovers.
      Hovering a tooltip while a{" "}
      <Link to="/components/popover">Popover</Link> or{" "}
      <Link to="/components/select">Select</Link> is open leaves them open;
      with <code>auto</code> they would close.
    </p>

    <p>
      Browsers without <code>hint</code> support (Safari) fall back to the{" "}
      <code>manual</code> state, as the spec prescribes. The tooltip stays in
      the top layer and still opens through <code>showPopover()</code>. Only
      the hint semantics disappear, and the library does not rely on them:
      its own timers control visibility.
    </p>

    <h2>Disabled triggers</h2>

    <p>
      Disabled elements fire no pointer events, so a tooltip on a disabled
      button never opens. The browser sets this rule. Wrap the button in a
      focusable element to work around it:
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
            "Side and alignment relative to the trigger; flips at viewport edges.",
        },
      ]}
    />

    <h2>Browser support</h2>

    <p>
      <code>popover="hint"</code> ships in Chrome 133+ and Firefox 149+, and
      other browsers fall back to <code>manual</code>. The tooltip works the
      same in both cases. The fade-in uses <code>@starting-style</code>;
      browsers without it show the tooltip without a fade.
    </p>
  </article>
);
