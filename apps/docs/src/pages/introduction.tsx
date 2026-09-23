import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { IntroductionSignup } from "../demos/introduction/signup";
import signupCode from "../demos/introduction/signup.tsx?raw";

export const IntroductionPage = () => (
  <article className="docs-page">
    <h1>blankjs</h1>

    <p className="docs-lead">
      Form-first React components built on native form elements. The browser
      handles focus, validation, and form data; blankjs adds structure and
      styles.
    </p>

    <Demo code={signupCode}>
      <IntroductionSignup />
    </Demo>

    <p>
      Submit it empty. The browser checks the fields and blankjs shows the
      messages. Fill it in and the submit handler gets the form's{" "}
      <code>FormData</code>. React holds no form state.
    </p>

    <CodeBlock code="npm install @blankjs/react" lang="bash" />

    <h2>The approach</h2>

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
        <code>details</code>/<code>summary</code>, and the native{" "}
        <code>name</code> attribute makes it exclusive without JavaScript.
      </li>
      <li>
        <strong>Form first.</strong> Every form control works inside a plain{" "}
        <code>form</code>: values land in <code>FormData</code>, reset
        restores defaults, and validation runs on the Constraint Validation
        API. You do not need a form library.
      </li>
      <li>
        <strong>A predictable event contract.</strong> Your handler runs
        first, then the library acts. Call <code>preventDefault()</code> to
        stop it. The rule holds in every component.
      </li>
      <li>
        <strong>Composition over configuration.</strong> Compound components
        with real DOM parts you can style and rearrange.
      </li>
    </ul>

    <h2>Next steps</h2>

    <p>
      Go to <Link to="/getting-started">Getting Started</Link> for setup, or
      open a component page such as{" "}
      <Link to="/components/select">Select</Link>.
    </p>
  </article>
);
