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
      <code>&lt;summary&gt;</code>. Toggling, keyboard support, exclusivity,
      and even the height animation are the browser's; the library adds
      styling, a chevron, and a controlled-mode contract.
    </p>

    <Demo code={basicCode}>
      <AccordionBasic />
    </Demo>

    <h2>Built on the platform</h2>

    <ul className="docs-list">
      <li>
        <strong>Toggling.</strong> A <code>summary</code> click or{" "}
        <code>Enter</code>/<code>Space</code> opens the item with zero
        JavaScript — it works before React hydrates, and even with scripts
        disabled.
      </li>
      <li>
        <strong>Semantics.</strong> Screen readers announce the expanded
        state from the element itself; there is no ARIA to wire because
        nothing is being imitated.
      </li>
      <li>
        <strong>Find-in-page.</strong> In Chromium, <code>Ctrl+F</code>{" "}
        searches inside closed items and opens the one that matches — a
        feature no <code>display: none</code> reimplementation gets for
        free.
      </li>
    </ul>

    <h2>Anatomy</h2>

    <CodeBlock code={anatomyCode} />

    <p>
      <code>Accordion.Item</code> renders a <code>details</code> element and{" "}
      <code>Accordion.Trigger</code> its <code>summary</code> — a real one,
      not a button pretending. <code>Accordion.Content</code> is a plain{" "}
      <code>div</code> that exists for padding; the open/closed state lives
      on the item.
    </p>

    <h2>Exclusive mode</h2>

    <p>
      <code>exclusive</code> on the root keeps at most one item open. This
      is not an effect watching state — the root hands every item the same
      native <code>name</code> attribute, and the browser closes the
      previous item the moment a new one opens, the same way radio buttons
      exclude each other:
    </p>

    <Demo code={exclusiveCode}>
      <AccordionExclusive />
    </Demo>

    <h2>Controlled</h2>

    <p>
      By default items manage themselves; <code>defaultOpen</code> just sets
      the starting state. Passing <code>open</code> inverts the ownership:
      the browser still flips the element on click, reports it through{" "}
      <code>onOpenChange</code> — and if your state does not follow, the DOM
      is reverted to match the prop. The prop is the boss; a click is a
      request.
    </p>

    <Demo code={controlledCode}>
      <AccordionControlled />
    </Demo>

    <p>
      To veto a change before it reaches state at all, call{" "}
      <code>preventDefault()</code> in <code>onToggle</code> —{" "}
      <code>onOpenChange</code> will not fire.
    </p>

    <h2>Animating to height: auto</h2>

    <p>
      The oldest excuse for faking accordions with divs was "you cannot
      animate <code>height: auto</code>". You can now — this is the entire
      animation, pure CSS:
    </p>

    <CodeBlock code={animationCode} lang="css" />

    <p>
      <code>interpolate-size: allow-keywords</code> lets the transition end
      at the keyword <code>auto</code>, and <code>::details-content</code>{" "}
      targets the browser's own collapsible region — no measuring, no
      resize observers. In browsers without support the accordion opens
      instantly, and <code>prefers-reduced-motion</code> disables the
      animation entirely.
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
      <code>details</code> itself is universal. The <code>name</code>{" "}
      attribute behind <code>exclusive</code> ships in Chrome 120+, Firefox
      130+, and Safari 17.2+; the height animation needs{" "}
      <code>interpolate-size</code> (Chrome 129+) and degrades to an instant
      open elsewhere. Neither gap breaks the component — that is the point
      of building on the element instead of around it.
    </p>
  </article>
);
