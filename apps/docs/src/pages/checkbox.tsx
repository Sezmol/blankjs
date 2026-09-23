import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { CheckboxBasic } from "../demos/checkbox/basic";
import basicCode from "../demos/checkbox/basic.tsx?raw";
import { CheckboxForm } from "../demos/checkbox/form";
import formCode from "../demos/checkbox/form.tsx?raw";
import { CheckboxIndeterminate } from "../demos/checkbox/indeterminate";
import indeterminateCode from "../demos/checkbox/indeterminate.tsx?raw";

export const CheckboxPage = () => (
  <article className="docs-page">
    <h1>Checkbox</h1>

    <p className="docs-lead">
      A styled native <code>&lt;input type="checkbox"&gt;</code>. Clicking a
      wrapping label toggles it, forms submit it, and screen readers announce
      it as a checkbox.
    </p>

    <Demo code={basicCode}>
      <CheckboxBasic />
    </Demo>

    <h2>Controlled and uncontrolled</h2>

    <p>
      Use <code>defaultChecked</code> for uncontrolled state, or{" "}
      <code>checked</code> with <code>onCheckedChange</code> for controlled.{" "}
      <code>onCheckedChange</code> receives a plain boolean. The native{" "}
      <code>onChange</code> fires first, and <code>preventDefault()</code>{" "}
      there cancels the state change.
    </p>

    <h2>Indeterminate</h2>

    <p>
      <code>indeterminate</code> shows the "some but not all" state of a
      parent checkbox. It only changes the look: it lives apart from{" "}
      <code>checked</code> and never submits. Checkbox applies it again after
      every change, so it stays as long as your state says so:
    </p>

    <Demo code={indeterminateCode}>
      <CheckboxIndeterminate />
    </Demo>

    <h2>In a form</h2>

    <p>
      A checked box submits its <code>value</code> (default{" "}
      <code>"on"</code>) under its <code>name</code>. An unchecked box
      submits nothing, as in plain HTML, so coerce the missing key in
      schemas. Reset restores <code>defaultChecked</code>.
    </p>

    <Demo code={formCode}>
      <CheckboxForm />
    </Demo>

    <p>
      Inside a <Link to="/components/field">Field</Link> the checkbox takes{" "}
      <code>id</code>, <code>disabled</code>, <code>required</code>, and ARIA
      wiring from context.
    </p>

    <h2>API</h2>

    <PropsTable
      props={[
        {
          name: "checked",
          type: "boolean",
          description: "Controlled checked state.",
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
          description: "Called with the next boolean on every toggle.",
        },
        {
          name: "indeterminate",
          type: "boolean",
          defaultValue: "false",
          description:
            "Visual mixed state for parent checkboxes. Independent of checked; never submitted.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Box size.",
        },
      ]}
    />

    <p>
      Every other native <code>input</code> prop passes through:{" "}
      <code>name</code>, <code>value</code>, <code>required</code>,{" "}
      <code>onChange</code>, and the rest.
    </p>
  </article>
);
