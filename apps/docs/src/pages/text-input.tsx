import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { TextInputBasic } from "../demos/text-input/basic";
import basicCode from "../demos/text-input/basic.tsx?raw";
import { TextInputSizes } from "../demos/text-input/sizes";
import sizesCode from "../demos/text-input/sizes.tsx?raw";

export const TextInputPage = () => (
  <article className="docs-page">
    <h1>TextInput</h1>

    <p className="docs-lead">
      A native <code>&lt;input&gt;</code> with the kit's styling and nothing
      else on top. The browser handles the input, blankjs adds the styles.
    </p>

    <Demo code={basicCode}>
      <TextInputBasic />
    </Demo>

    <p>
      Inside a <Link to="/components/field">Field</Link> it takes{" "}
      <code>id</code>, ARIA wiring, <code>disabled</code>, and{" "}
      <code>required</code> from context. Native constraints (
      <code>type="email"</code>, <code>minLength</code>, <code>pattern</code>)
      drive the error display, as in the email example above, with no
      validation code.
    </p>

    <h2>Sizes</h2>

    <Demo code={sizesCode}>
      <TextInputSizes />
    </Demo>

    <h2>API</h2>

    <PropsTable
      props={[
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Padding and font size.",
        },
      ]}
    />

    <p>
      TextInput passes through every native <code>input</code> prop: all the{" "}
      <code>type</code> values, <code>inputMode</code>,{" "}
      <code>autoComplete</code>, <code>pattern</code>, and the rest. For
      passwords with a visibility toggle use <code>PasswordField</code>, for
      numbers with steppers use{" "}
      <Link to="/components/number-field">NumberField</Link>.
    </p>
  </article>
);
