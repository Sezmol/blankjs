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
      Native radio inputs sharing a <code>name</code> — the browser provides
      the exclusivity and the arrow-key navigation; the library provides one
      value instead of N checked booleans.
    </p>

    <Demo code={basicCode}>
      <RadioGroupBasic />
    </Demo>

    <p>
      Arrow keys move and select within the group, <code>Tab</code> enters
      and leaves it as a single stop — that is native radio behavior, not
      library code. An item with children renders a wrapping{" "}
      <code>label</code>, so the text is clickable for free.
    </p>

    <h2>Labeling the group</h2>

    <p>
      A <code>div role="radiogroup"</code> is not a labelable element —{" "}
      <code>label htmlFor</code> silently does nothing. Inside a{" "}
      <Link to="/components/field">Field</Link> the group is wired through{" "}
      <code>aria-labelledby</code> instead, automatically. This is the
      component that taught the kit that distinction.
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
            "Shared native name — the FormData key and the browser's grouping mechanism.",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Disables every item in the group.",
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
