import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { MultiSelectBasic } from "../demos/multi-select/basic";
import basicCode from "../demos/multi-select/basic.tsx?raw";
import { MultiSelectForm } from "../demos/multi-select/form";
import formCode from "../demos/multi-select/form.tsx?raw";

export const MultiSelectPage = () => (
  <article className="docs-page">
    <h1>MultiSelect</h1>

    <p className="docs-lead">
      Like <Link to="/components/select">Select</Link>, but the value is
      honestly a <code>string[]</code> — a separate component instead of a{" "}
      <code>multiple</code> prop, so neither API has to lie about its type.
    </p>

    <Demo code={basicCode}>
      <MultiSelectBasic />
    </Demo>

    <h2>Picking several things</h2>

    <p>
      Clicking an item toggles it and <strong>keeps the list open</strong> —
      closing after every pick is the single most annoying multi-select
      mistake. <code>Escape</code> or clicking outside closes;{" "}
      <code>MultiSelect.Value</code> takes a render prop so you decide how
      the selection reads on the trigger.
    </p>

    <h2>In a form</h2>

    <p>
      Each selected value renders its own hidden input under the shared{" "}
      <code>name</code> — on the server it is{" "}
      <code>formData.getAll("days")</code>, and <code>serialize</code>{" "}
      collects repeated names into an array. <code>required</code> works
      through a proxy text input that is empty when nothing is selected, so
      the native constraint and the{" "}
      <Link to="/components/field">Field</Link> error pipeline apply:
    </p>

    <Demo code={formCode}>
      <MultiSelectForm />
    </Demo>

    <h2>API</h2>

    <h3>MultiSelect.Root</h3>

    <PropsTable
      props={[
        {
          name: "value / defaultValue / onValueChange",
          type: "string[]",
          description: "The selection, controlled or uncontrolled.",
        },
        {
          name: "open / defaultOpen / onOpenChange",
          type: "boolean",
          description: "List visibility.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Form participation: one hidden input per selected value.",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Disables the trigger.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Sizes the trigger and the list.",
        },
      ]}
    />

    <h3>MultiSelect.Value</h3>

    <PropsTable
      props={[
        {
          name: "placeholder",
          type: "ReactNode",
          description: "Shown while nothing is selected.",
        },
        {
          name: "children",
          type: "(values: string[]) => ReactNode",
          description: "Render prop mapping the selection to trigger text.",
        },
      ]}
    />

    <h3>MultiSelect.Item</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description: "The value this item toggles in the selection.",
        },
      ]}
    />

    <p>
      <code>MultiSelect.Clear</code> empties the whole selection and renders
      nothing while it is already empty.
    </p>
  </article>
);
