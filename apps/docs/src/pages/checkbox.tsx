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
      A styled native <code>&lt;input type="checkbox"&gt;</code> — the input
      itself, not a <code>div</code> pretending. Clicking a wrapping label
      toggles it, forms see it, screen readers know it.
    </p>

    <Demo code={basicCode}>
      <CheckboxBasic />
    </Demo>

    <h2>Controlled and uncontrolled</h2>

    <p>
      <code>defaultChecked</code> for uncontrolled, <code>checked</code> +{" "}
      <code>onCheckedChange</code> for controlled — a plain boolean callback,
      no event digging. The native <code>onChange</code> still fires first,
      and <code>preventDefault()</code> there vetoes the state change.
    </p>

    <h2>Indeterminate</h2>

    <p>
      The "some but not all" state of a parent checkbox.{" "}
      <code>indeterminate</code> is a prop, not a value — it is visual-only,
      lives outside <code>checked</code>, and never submits. The component
      re-asserts it after every change, so it stays exactly as long as your
      state says it should:
    </p>

    <Demo code={indeterminateCode}>
      <CheckboxIndeterminate />
    </Demo>

    <h2>In a form</h2>

    <p>
      A checked box submits its <code>value</code> (default{" "}
      <code>"on"</code>) under its <code>name</code>; unchecked submits
      nothing at all — that is native behavior, coerce accordingly in
      schemas. Reset restores <code>defaultChecked</code>.
    </p>

    <Demo code={formCode}>
      <CheckboxForm />
    </Demo>

    <p>
      Inside a <Link to="/components/field">Field</Link> the checkbox picks
      up <code>id</code>, <code>disabled</code>, <code>required</code>, and
      ARIA wiring from context automatically.
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
      Every other native <code>input</code> prop passes through —{" "}
      <code>name</code>, <code>value</code>, <code>required</code>,{" "}
      <code>onChange</code>.
    </p>
  </article>
);
