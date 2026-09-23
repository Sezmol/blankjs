import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { RadioGroupBasic } from "../demos/radio-group/basic";
import basicCode from "../demos/radio-group/basic.tsx?raw";
import { RadioGroupControlled } from "../demos/radio-group/controlled";
import controlledCode from "../demos/radio-group/controlled.tsx?raw";

export const RadioGroupPage = () => (
  <article className="docs-page">
    <h1>RadioGroup</h1>

    <p className="docs-lead">
      Native radio inputs sharing a <code>name</code>. The browser keeps one
      radio checked and handles arrow-key navigation. The library gives you
      one value in place of N checked booleans.
    </p>

    <Demo code={basicCode}>
      <RadioGroupBasic />
    </Demo>

    <p>
      Arrow keys move and select within the group, and <code>Tab</code>{" "}
      enters and leaves it as a single stop. The browser does this for
      native radios. An item with children renders a wrapping{" "}
      <code>label</code>, so clicking the text selects the radio.
    </p>

    <h2>Labeling the group</h2>

    <p>
      A <code>div role="radiogroup"</code> is not a labelable element, so{" "}
      <code>label htmlFor</code> does nothing. Inside a{" "}
      <Link to="/components/field">Field</Link>, Field wires the group
      through <code>aria-labelledby</code> instead.
    </p>

    <h2>Controlled</h2>

    <Demo code={controlledCode}>
      <RadioGroupControlled />
    </Demo>

    <h2>API</h2>

    <h3>RadioGroup.Root</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description: "Controlled selected value.",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "Initial selection in uncontrolled mode; reset target.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Called with the newly selected value.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Shared native name: the FormData key and the browser's grouping mechanism.",
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
            "Blocks submit until a radio is checked. Field.Root required does the same.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Radio size, stamped on the group.",
        },
      ]}
    />

    <h3>RadioGroup.Item</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description: "The value this radio contributes when selected.",
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
