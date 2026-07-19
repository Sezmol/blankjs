import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { ComboboxBasic } from "../demos/combobox/basic";
import basicCode from "../demos/combobox/basic.tsx?raw";
import { ComboboxForm } from "../demos/combobox/form";
import formCode from "../demos/combobox/form.tsx?raw";

export const ComboboxPage = () => (
  <article className="docs-page">
    <h1>Combobox</h1>

    <p className="docs-lead">
      A text input with a filtered listbox. The deliberate part of the
      design: <strong>you own the filtering</strong> — the library owns
      keyboard navigation, ARIA wiring, and commit semantics.
    </p>

    <Demo code={basicCode}>
      <ComboboxBasic />
    </Demo>

    <h2>The filtering contract</h2>

    <p>
      <code>inputValue</code> is controlled by you; which items you render
      under <code>Combobox.Content</code> <em>is</em> the filter. Substring
      match, fuzzy search, async results from a server — all the same to
      the component, because it never sees your data source, only the
      rendered items. No <code>filter</code> prop to fight, no built-in
      matcher to disable.
    </p>

    <h2>Draft and commit</h2>

    <p>
      What the user types is a draft. It becomes real only when an item is
      committed — by click, or <code>Enter</code> on the highlighted item.{" "}
      <code>Escape</code> and blur revert the draft to the last committed
      label, so the input never lies about the value: you cannot type
      "Berl", walk away, and have the form submit a value the user never
      chose.
    </p>

    <p>
      Two implementation details you get for free: item selection happens
      on <code>pointerdown</code> with the default prevented, so focus
      never leaves the input; and the highlighted item scrolls into view as
      the arrows move.
    </p>

    <h2>In a form</h2>

    <p>
      Give <code>Combobox.Root</code> a <code>name</code> and a hidden
      input carries the committed value into <code>FormData</code> —{" "}
      <code>required</code> and the{" "}
      <Link to="/components/field">Field</Link> error pipeline work
      unchanged. <code>Combobox.Clear</code> empties both the input and the
      value:
    </p>

    <Demo code={formCode}>
      <ComboboxForm />
    </Demo>

    <h2>API</h2>

    <h3>Combobox.Root</h3>

    <PropsTable
      props={[
        {
          name: "value / defaultValue / onValueChange",
          type: "string",
          description: "The committed value, controlled or uncontrolled.",
        },
        {
          name: "inputValue / defaultInputValue / onInputValueChange",
          type: "string",
          description:
            "The draft text. Control it to drive your filtering.",
        },
        {
          name: "open / defaultOpen / onOpenChange",
          type: "boolean",
          description: "List visibility.",
        },
        {
          name: "name",
          type: "string",
          description: "Renders a hidden input for form participation.",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Disables the input and the toggle.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Sizes the input and the list.",
        },
      ]}
    />

    <h3>Combobox.Item</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description: "The value committed when this item is picked.",
        },
        {
          name: "textValue",
          type: "string",
          description:
            "Label written into the input on commit; defaults to the item's text content.",
        },
      ]}
    />

    <p>
      <code>Combobox.Input</code> takes native input props;{" "}
      <code>Combobox.Clear</code> renders nothing while there is nothing to
      clear.
    </p>
  </article>
);
