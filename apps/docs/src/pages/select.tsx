import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { SelectBasic } from "../demos/select/basic";
import basicCode from "../demos/select/basic.tsx?raw";
import { SelectForm } from "../demos/select/form";
import formCode from "../demos/select/form.tsx?raw";

const anatomyCode = `
<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="…" />
  </Select.Trigger>

  <Select.Clear />

  <Select.Content>
    <Select.Item value="…">…</Select.Item>
  </Select.Content>
</Select.Root>
`;

export const SelectPage = () => (
  <article className="docs-page">
    <h1>Select</h1>

    <p className="docs-lead">
      Single-value picker with typeahead and full keyboard navigation. Submits
      through a hidden input, so the value lands in <code>FormData</code> like
      any native control.
    </p>

    <Demo code={basicCode}>
      <SelectBasic />
    </Demo>

    <h2>Anatomy</h2>

    <CodeBlock code={anatomyCode} />

    <h2>Displaying the value</h2>

    <p>
      <code>Select.Value</code> renders the raw <code>value</code> string by
      default — the same string that lands in <code>FormData</code>. When
      values are codes rather than readable text, pass a render function to map
      the value to its label:
    </p>

    <CodeBlock
      code={`<Select.Value placeholder="Select a country">
  {(value) => countries[value]}
</Select.Value>`}
    />

    <h2>In a form</h2>

    <p>
      Give <code>Select.Root</code> a <code>name</code> and it renders a hidden
      input bound to the selection. <code>required</code> on the field blocks
      submit while the select is empty — through the Constraint Validation API,
      exactly like a native control — and <code>Field.Error</code> shows the
      message.
    </p>

    <Demo code={formCode}>
      <SelectForm />
    </Demo>

    <h2>API</h2>

    <h3>Select.Root</h3>

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
          description: "Initial value in uncontrolled mode.",
        },
        {
          name: "onValueChange",
          type: "(value: string | undefined) => void",
          description:
            "Called on selection change. undefined arrives when Select.Clear empties the value.",
        },
        {
          name: "open",
          type: "boolean",
          description: "Controlled popup visibility.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          defaultValue: "false",
          description: "Whether the popup starts open in uncontrolled mode.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Called when the popup opens or closes.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Name of the hidden input. Required for form participation.",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Disables the trigger and drops the value from FormData.",
        },
        {
          name: "required",
          type: "boolean",
          defaultValue: "false",
          description:
            "Marks the hidden input required — empty select blocks form submit.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Sizes the trigger and items.",
        },
      ]}
    />

    <h3>Select.Trigger</h3>

    <PropsTable
      props={[
        {
          name: "asChild",
          type: "boolean",
          defaultValue: "false",
          description:
            "Renders the child element instead of the built-in button, merging trigger props onto it.",
        },
      ]}
    />

    <h3>Select.Content</h3>

    <PropsTable
      props={[
        {
          name: "container",
          type: "HTMLElement",
          defaultValue: "document.body",
          description: "Portal container for the popup.",
        },
      ]}
    />

    <h3>Select.Item</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description: "Value submitted when this item is selected.",
        },
        {
          name: "textValue",
          type: "string",
          description:
            "Text used for typeahead matching when children are not plain text.",
        },
      ]}
    />

    <h3>Select.Value</h3>

    <PropsTable
      props={[
        {
          name: "placeholder",
          type: "ReactNode",
          description: "Content shown while nothing is selected.",
        },
        {
          name: "children",
          type: "(value: string) => ReactNode",
          description:
            "Render function mapping the selected value to display content. Without it, the raw value string is rendered.",
        },
      ]}
    />

    <h3>Select.Clear</h3>

    <p>
      A button that empties the selection and returns focus to the trigger.
      Renders nothing while there is no value or the select is disabled.
      Accepts every native button prop; <code>preventDefault()</code> in your{" "}
      <code>onClick</code> vetoes the clear.
    </p>

    <h2>Keyboard</h2>

    <div className="docs-props-wrap">
      <table className="docs-props">
        <thead>
          <tr>
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>Enter</code> / <code>Space</code>
            </td>
            <td>Open the popup, commit the active item.</td>
          </tr>
          <tr>
            <td>
              <code>ArrowDown</code> / <code>ArrowUp</code>
            </td>
            <td>Move the active item.</td>
          </tr>
          <tr>
            <td>
              <code>Home</code> / <code>End</code>
            </td>
            <td>Jump to the first / last item.</td>
          </tr>
          <tr>
            <td>
              <code>Escape</code>
            </td>
            <td>Close the popup without committing.</td>
          </tr>
          <tr>
            <td>
              <code>Tab</code>
            </td>
            <td>Close the popup and move focus on.</td>
          </tr>
          <tr>
            <td>Printable characters</td>
            <td>
              Typeahead — jumps to the first matching item. While a search is
              buffered, <code>Space</code> is part of the query instead of a
              commit.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
);
