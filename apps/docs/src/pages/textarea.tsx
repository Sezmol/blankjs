import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { TextareaBasic } from "../demos/textarea/basic";
import basicCode from "../demos/textarea/basic.tsx?raw";
import { TextareaValidation } from "../demos/textarea/validation";
import validationCode from "../demos/textarea/validation.tsx?raw";

export const TextareaPage = () => (
  <article className="docs-page">
    <h1>Textarea</h1>

    <p className="docs-lead">
      A native <code>&lt;textarea&gt;</code> that grows with its content
      through CSS <code>field-sizing: content</code>, with no JavaScript
      measuring rows.
    </p>

    <Demo code={basicCode}>
      <TextareaBasic />
    </Demo>

    <h2>Auto-grow in CSS</h2>

    <p>
      Auto-growing textareas used to need mirror elements and scroll-height
      math on every keystroke. With <code>field-sizing: content</code> the
      browser sizes the element to its value, and <code>rows</code> (default
      3) sets the minimum height. The user can still resize it vertically by
      hand. Browsers without support show a fixed-height textarea with a
      resize handle, and nothing breaks.
    </p>

    <h2>Validation</h2>

    <p>
      <code>minLength</code>, <code>maxLength</code>, and{" "}
      <code>required</code> are native constraints, so the whole Field error
      pipeline applies:
    </p>

    <Demo code={validationCode}>
      <TextareaValidation />
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
        {
          name: "rows",
          type: "number",
          defaultValue: "3",
          description: "Minimum height in lines. Auto-grow starts from here.",
        },
      ]}
    />

    <p>
      Every other native <code>textarea</code> prop passes through.
    </p>
  </article>
);
