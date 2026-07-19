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
      else on top — the component every form starts with, and the clearest
      statement of how blankjs works: the platform does the input, the
      library does the paint.
    </p>

    <Demo code={basicCode}>
      <TextInputBasic />
    </Demo>

    <p>
      Everything interesting happens around it: inside a{" "}
      <Link to="/components/field">Field</Link> it picks up <code>id</code>,
      ARIA wiring, <code>disabled</code>, and <code>required</code> from
      context, and native constraints (<code>type="email"</code>,{" "}
      <code>minLength</code>, <code>pattern</code>) drive the error display —
      as in the email example above, with zero validation code.
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
      Every native <code>input</code> prop passes through: all the{" "}
      <code>type</code> values, <code>inputMode</code>,{" "}
      <code>autoComplete</code>, <code>pattern</code>, and the rest. For
      passwords with a visibility toggle there is a dedicated{" "}
      <code>PasswordField</code>; for numbers with steppers,{" "}
      <Link to="/components/number-field">NumberField</Link>.
    </p>
  </article>
);
