import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { SwitchBasic } from "../demos/switch/basic";
import basicCode from "../demos/switch/basic.tsx?raw";
import { SwitchForm } from "../demos/switch/form";
import formCode from "../demos/switch/form.tsx?raw";

export const SwitchPage = () => (
  <article className="docs-page">
    <h1>Switch</h1>

    <p className="docs-lead">
      A native checkbox with <code>role="switch"</code>. Screen readers
      announce "on/off" instead of "checked/unchecked". Label clicks, the
      keyboard, and form behavior come from the input underneath.
    </p>

    <Demo code={basicCode}>
      <SwitchBasic />
    </Demo>

    <h2>Switch or Checkbox</h2>

    <p>
      Pick by meaning. A switch turns a setting on or off and takes effect
      right away, like notifications or dark mode. A checkbox marks a choice
      that the form submits later. If the control sits next to a submit
      button, use a <Link to="/components/checkbox">Checkbox</Link>.
    </p>

    <h2>Structure</h2>

    <p>
      The rendered markup is a <code>span.bk-switch</code> wrapper (your{" "}
      <code>className</code> and <code>style</code> land here) around the
      real input and a thumb element. The input stays focusable and
      form-associated; the thumb is <code>aria-hidden</code> decoration
      driven by <code>:checked</code> in CSS.
    </p>

    <h2>In a form</h2>

    <p>
      Same native contract as a checkbox: on submits <code>value</code>{" "}
      under <code>name</code>, off submits nothing, reset restores{" "}
      <code>defaultChecked</code>.
    </p>

    <Demo code={formCode}>
      <SwitchForm />
    </Demo>

    <h2>API</h2>

    <PropsTable
      props={[
        {
          name: "checked",
          type: "boolean",
          description: "Controlled state.",
        },
        {
          name: "defaultChecked",
          type: "boolean",
          defaultValue: "false",
          description: "Initial state in uncontrolled mode; reset target.",
        },
        {
          name: "onCheckedChange",
          type: "(checked: boolean) => void",
          description: "Called with the next boolean on every flip.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Track and thumb size.",
        },
      ]}
    />
  </article>
);
