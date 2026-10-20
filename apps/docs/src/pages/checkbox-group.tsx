import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { CheckboxGroupBasic } from "../demos/checkbox-group/basic";
import basicCode from "../demos/checkbox-group/basic.tsx?raw";
import { CheckboxGroupLimit } from "../demos/checkbox-group/limit";
import limitCode from "../demos/checkbox-group/limit.tsx?raw";
import { CheckboxGroupControlled } from "../demos/checkbox-group/controlled";
import controlledCode from "../demos/checkbox-group/controlled.tsx?raw";

export const CheckboxGroupPage = () => (
  <article className="docs-page">
    <h1>CheckboxGroup</h1>

    <p className="docs-lead">
      Native checkboxes that share one value. The library gives you an array
      in place of N checked booleans, and a required rule for the whole
      group: the native <code>required</code> on a checkbox only covers that
      one box.
    </p>

    <Demo code={basicCode}>
      <CheckboxGroupBasic />
    </Demo>

    <p>
      Every item is a real <code>input type="checkbox"</code>, so the form
      submits each checked value under the group's <code>name</code> and{" "}
      <code>formData.getAll(name)</code> returns the list. An item with
      children renders a wrapping <code>label</code>.
    </p>

    <h2>Required</h2>

    <p>
      A required group needs at least one checked item that is not disabled.
      A disabled item does not go into the form, so it does not count even
      when it is checked. While nothing counts, every enabled item carries the
      native <code>required</code> attribute: the browser blocks the submit
      with <code>valueMissing</code> and{" "}
      <Link to="/components/field">Field</Link> shows the error and focuses
      the first item.
    </p>

    <p>
      The browser's own message for <code>valueMissing</code> talks about a
      single box ("check this box"), which reads wrong for a group. Give the
      group its own text with <code>errorMessages.valueMissing</code> on{" "}
      <code>Field.Root</code>, as the demo does.
    </p>

    <h2>Validation</h2>

    <p>
      Field's <code>validate</code> receives the checked values joined by
      commas, the same as MultiSelect. Use the second argument,{" "}
      <code>formData.getAll(name)</code>, for the exact list. The message goes
      on every item of the group.
    </p>

    <Demo code={limitCode}>
      <CheckboxGroupLimit />
    </Demo>

    <h2>Order</h2>

    <p>
      <code>value</code> keeps the order in which the user checked the items.{" "}
      <code>FormData</code> follows the order of the markup.
    </p>

    <h2>Keyboard</h2>

    <p>
      <code>Tab</code> moves from one checkbox to the next and{" "}
      <code>Space</code> toggles it. There are no arrow keys: unlike radios,
      every checkbox is its own tab stop in the browser.
    </p>

    <h2>Labeling the group</h2>

    <p>
      The root is a <code>div role="group"</code>. Inside a Field, Field wires
      it through <code>aria-labelledby</code>.
    </p>

    <h2>Controlled</h2>

    <Demo code={controlledCode}>
      <CheckboxGroupControlled />
    </Demo>

    <h2>API</h2>

    <h3>CheckboxGroup.Root</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string[]",
          description: "Controlled checked values. [] means nothing is checked.",
        },
        {
          name: "defaultValue",
          type: "string[]",
          defaultValue: "[]",
          description: "Initial values in uncontrolled mode; reset target.",
        },
        {
          name: "onValueChange",
          type: "(value: string[]) => void",
          description:
            "Called with the new list when an item is toggled or a form reset restores the default.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Native name of every item: the FormData key. Without it nothing is submitted.",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Disables every item in the group.",
        },
        {
          name: "required",
          type: "boolean",
          defaultValue: "false",
          description:
            "Blocks submit until an enabled item is checked. Field.Root required does the same.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Checkbox size, stamped on the group.",
        },
      ]}
    />

    <h3>CheckboxGroup.Item</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description: "The value this checkbox adds to the group when checked.",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Disables this item; overrides the group setting.",
        },
      ]}
    />
  </article>
);
