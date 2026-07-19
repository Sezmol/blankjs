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
      A native <code>&lt;textarea&gt;</code> that grows with its content —
      no rows-measuring JavaScript, just CSS{" "}
      <code>field-sizing: content</code>.
    </p>

    <Demo code={basicCode}>
      <TextareaBasic />
    </Demo>

    <h2>Auto-grow, the CSS way</h2>

    <p>
      Auto-growing textareas used to mean mirror elements and scroll-height
      math on every keystroke. <code>field-sizing: content</code> moves that
      into the browser: the element sizes itself to its value, and{" "}
      <code>rows</code> (default 3) acts as the minimum height. Manual
      vertical resize stays available on top. In browsers without support
      the textarea is simply a fixed-height textarea with a resize handle —
      nothing breaks.
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
          description:
            "Minimum height in lines — the floor the auto-grow starts from.",
        },
      ]}
    />

    <p>
      Every other native <code>textarea</code> prop passes through.
    </p>
  </article>
);
