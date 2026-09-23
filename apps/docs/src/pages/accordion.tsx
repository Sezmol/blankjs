import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { AccordionBasic } from "../demos/accordion/basic";
import basicCode from "../demos/accordion/basic.tsx?raw";
import { AccordionControlled } from "../demos/accordion/controlled";
import controlledCode from "../demos/accordion/controlled.tsx?raw";
import { AccordionExclusive } from "../demos/accordion/exclusive";
import exclusiveCode from "../demos/accordion/exclusive.tsx?raw";

const anatomyCode = `
<Accordion.Root>
  <Accordion.Item>
    <Accordion.Trigger>Question</Accordion.Trigger>
    <Accordion.Content>Answer</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
`;

const animationCode = `
.bk-accordion-item {
  interpolate-size: allow-keywords;
}

.bk-accordion-item::details-content {
  block-size: 0;
  overflow: hidden;
  transition:
    block-size var(--bk-duration-base) ease,
    content-visibility var(--bk-duration-base) allow-discrete;
}

.bk-accordion-item[open]::details-content {
  block-size: auto;
}
`;

export const AccordionPage = () => (
  <article className="docs-page">
    <h1>Accordion</h1>

    <p className="docs-lead">
      Collapsible sections built on native <code>&lt;details&gt;</code> and{" "}
      <code>&lt;summary&gt;</code>. The browser handles toggling, keyboard
      support, exclusivity, and the height animation. The library adds
      styling, a chevron, and a controlled mode.
    </p>

    <Demo code={basicCode}>
      <AccordionBasic />
    </Demo>

    <h2>Built on the platform</h2>

    <ul className="docs-list">
      <li>
        <strong>Toggling.</strong> A <code>summary</code> click or{" "}
        <code>Enter</code>/<code>Space</code> opens the item without
        JavaScript. It works before React hydrates and with scripts disabled.
      </li>
      <li>
        <strong>Semantics.</strong> Screen readers read the expanded state
        from the element itself, so there is no ARIA to wire.
      </li>
      <li>
        <strong>Find-in-page.</strong> In Chromium, <code>Ctrl+F</code>{" "}
        searches inside closed items and opens the one that matches. An
        implementation built on <code>display: none</code> cannot do this.
      </li>
    </ul>

    <h2>Anatomy</h2>

    <CodeBlock code={anatomyCode} />

    <p>
      <code>Accordion.Item</code> renders a <code>details</code> element and{" "}
      <code>Accordion.Trigger</code> renders its <code>summary</code>.{" "}
      <code>Accordion.Content</code> is a plain <code>div</code> for padding;
      the open/closed state lives on the item.
    </p>

    <h2>Exclusive mode</h2>

    <p>
      <code>exclusive</code> on the root keeps at most one item open. The
      root gives every item the same native <code>name</code> attribute, and
      the browser closes the previous item when a new one opens, the same
      way radio buttons exclude each other:
    </p>

    <Demo code={exclusiveCode}>
      <AccordionExclusive />
    </Demo>

    <h2>Controlled</h2>

    <p>
      By default items manage themselves, and <code>defaultOpen</code> sets
      the starting state. Pass <code>open</code> to take ownership. The
      browser still flips the element on click, and Accordion reports it
      through <code>onOpenChange</code>. If your state does not follow,
      Accordion reverts the DOM to match the prop, so a click only asks for a
      change.
    </p>

    <Demo code={controlledCode}>
      <AccordionControlled />
    </Demo>

    <p>
      To veto a change before it reaches state, call{" "}
      <code>preventDefault()</code> in <code>onToggle</code>.{" "}
      <code>onOpenChange</code> then does not fire.
    </p>

    <h2>Animating to height: auto</h2>

    <p>
      Div-based accordions used to exist because CSS could not animate{" "}
      <code>height: auto</code>. Current CSS can, and this is the whole
      animation:
    </p>

    <CodeBlock code={animationCode} lang="css" />

    <p>
      <code>interpolate-size: allow-keywords</code> lets the transition end
      at the keyword <code>auto</code>, and <code>::details-content</code>{" "}
      targets the browser's own collapsible region, so nothing measures
      heights or watches resizes. Browsers without support open the item
      without animation, and <code>prefers-reduced-motion</code> turns the
      animation off.
    </p>

    <h2>API</h2>

    <h3>Accordion.Root</h3>

    <PropsTable
      props={[
        {
          name: "exclusive",
          type: "boolean",
          defaultValue: "false",
          description:
            "Allows at most one open item, enforced by the browser through a shared native name attribute.",
        },
      ]}
    />

    <h3>Accordion.Item</h3>

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
          description: "Whether the item starts open in uncontrolled mode.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description:
            "Called on every toggle, including browser-initiated ones like find-in-page.",
        },
      ]}
    />

    <p>
      <code>Accordion.Trigger</code> and <code>Accordion.Content</code> take
      every native <code>summary</code> and <code>div</code> prop
      respectively and add nothing of their own.
    </p>

    <h2>Browser support</h2>

    <p>
      Every current browser supports <code>details</code>. The{" "}
      <code>name</code> attribute behind <code>exclusive</code> ships in
      Chrome 120+, Firefox 130+, and Safari 17.2+. The height animation needs{" "}
      <code>interpolate-size</code> (Chrome 129+), and other browsers open
      the item without animation. Neither gap breaks the component.
    </p>
  </article>
);
