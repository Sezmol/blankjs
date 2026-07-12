import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";

export const IntroductionPage = () => (
  <article className="docs-page">
    <h1>blankjs</h1>

    <p className="docs-lead">
      Form-first React components built on native form elements. The browser is
      an ally, not an obstacle.
    </p>

    <CodeBlock code="npm install @blankjs/react" lang="bash" />

    <h2>Why another component library?</h2>

    <p>
      Most libraries rebuild form controls from <code>div</code>s and ARIA: a{" "}
      <code>button</code> pretending to be a checkbox, state mirrored into a
      hidden input, focus managed by hand. blankjs styles the real elements
      instead and lets the platform do the work.
    </p>

    <ul className="docs-list">
      <li>
        <strong>Native first.</strong> Checkbox is an{" "}
        <code>input type="checkbox"</code>. Dialog is a <code>dialog</code>{" "}
        with a real focus trap from <code>showModal()</code>. Accordion is{" "}
        <code>details</code>/<code>summary</code> — exclusivity comes from the
        native <code>name</code> attribute with zero JavaScript.
      </li>
      <li>
        <strong>Form first.</strong> Every component participates in a plain{" "}
        <code>form</code>: values land in <code>FormData</code>, reset
        restores defaults, validation rides on the Constraint Validation API.
        No form library required.
      </li>
      <li>
        <strong>A predictable event contract.</strong> Your handler runs
        first, then the library acts — unless you call{" "}
        <code>preventDefault()</code>. One rule, every component.
      </li>
      <li>
        <strong>Composition over configuration.</strong> Compound components
        with real DOM parts you can style and rearrange.
      </li>
    </ul>

    <h2>Next steps</h2>

    <p>
      Head to <Link to="/getting-started">Getting Started</Link> for setup, or
      jump straight to a component like{" "}
      <Link to="/components/select">Select</Link>.
    </p>
  </article>
);
