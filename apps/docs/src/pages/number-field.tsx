import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { NumberFieldBasic } from "../demos/number-field/basic";
import basicCode from "../demos/number-field/basic.tsx?raw";
import { NumberFieldStep } from "../demos/number-field/step";
import stepCode from "../demos/number-field/step.tsx?raw";
import { NumberFieldValidation } from "../demos/number-field/validation";
import validationCode from "../demos/number-field/validation.tsx?raw";

export const NumberFieldPage = () => (
  <article className="docs-page">
    <h1>NumberField</h1>

    <p className="docs-lead">
      A number input with large stepper buttons in place of the native
      spinner. Underneath it stays a real{" "}
      <code>&lt;input type="number"&gt;</code>, so the browser handles the
      arithmetic, the limits, the keyboard, and the validation.
    </p>

    <Demo code={basicCode}>
      <NumberFieldBasic />
    </Demo>

    <h2>Bounds</h2>

    <p>
      The stepper buttons call the native <code>stepUp()</code> /{" "}
      <code>stepDown()</code>, which respect <code>min</code>,{" "}
      <code>max</code>, and <code>step</code>. At a bound NumberField disables
      the matching button:
    </p>

    <Demo code={stepCode}>
      <NumberFieldStep />
    </Demo>

    <h2>Validation</h2>

    <p>
      Wrap it in a <Link to="/components/field">Field</Link> and use{" "}
      <code>errorMessages</code> to replace the browser's wording for the
      native constraints. Type a value over the limit, or letters into the
      field, and submit:
    </p>

    <Demo code={validationCode}>
      <NumberFieldValidation />
    </Demo>

    <h2>No locale formatting</h2>

    <p>
      NumberField does not render <code>1 000 000</code> with thousand
      separators. The HTML spec lets a number input show only the number
      itself, so the separators have nowhere to go. Libraries that format
      switch to <code>type="text"</code> and rewrite parsing, stepping, and
      validation by hand. blankjs keeps the real input and the browser
      behavior that comes with it. For formatted input, use a separate
      component built on a text input.
    </p>

    <h2>API</h2>

    <p>
      NumberField passes through every native <code>input</code> prop except{" "}
      <code>type</code>: <code>min</code>, <code>max</code>, <code>step</code>,{" "}
      <code>required</code>, <code>placeholder</code>, and the rest.
    </p>

    <PropsTable
      props={[
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Control size, matching the other form controls.",
        },
      ]}
    />

    <CodeBlock
      code={`<NumberField name="qty" min={0} max={10} step={2} defaultValue={4} />`}
    />

    <p>
      The stepper buttons are <code>tabIndex={-1}</code>: keyboard users step
      with the arrow keys inside the input, so the buttons stay out of the
      tab order.
    </p>
  </article>
);
