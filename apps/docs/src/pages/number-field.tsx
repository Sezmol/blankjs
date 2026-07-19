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
      A number input with proper stepper buttons. Underneath it stays a real{" "}
      <code>&lt;input type="number"&gt;</code> — the arithmetic, the limits,
      the keyboard, and the validation all belong to the browser.
    </p>

    <Demo code={basicCode}>
      <NumberFieldBasic />
    </Demo>

    <h2>Why not a plain number input</h2>

    <p>
      The native spinner is the least usable part of{" "}
      <code>type="number"</code>: a 12-pixel hit target, styled differently in
      every browser, and invisible in Firefox until hover. NumberField hides
      it and renders real buttons — everything else is untouched platform:
    </p>

    <ul className="docs-list">
      <li>
        Arrow keys step the value; <code>min</code>/<code>max</code>/
        <code>step</code> clamp it — no arithmetic in the library
      </li>
      <li>
        The value serializes into <code>FormData</code> and restores on form
        reset
      </li>
      <li>
        Invalid input reports through <code>ValidityState</code> —{" "}
        <code>badInput</code>, <code>stepMismatch</code>,{" "}
        <code>rangeOverflow</code> — so <code>Field</code> validation works
        with no extra wiring
      </li>
    </ul>

    <h2>Bounds</h2>

    <p>
      The stepper buttons call the native <code>stepUp()</code> /{" "}
      <code>stepDown()</code>, which respect <code>min</code>,{" "}
      <code>max</code>, and <code>step</code>. At a bound the matching button
      disables:
    </p>

    <Demo code={stepCode}>
      <NumberFieldStep />
    </Demo>

    <h2>Validation</h2>

    <p>
      Wrap it in a <Link to="/components/field">Field</Link> and the native
      constraints speak your words through <code>errorMessages</code>. Type a
      value over the limit, or letters into the field, and submit:
    </p>

    <Demo code={validationCode}>
      <NumberFieldValidation />
    </Demo>

    <h2>No locale formatting — on purpose</h2>

    <p>
      NumberField will not render <code>1 000 000</code> with thousand
      separators: a native number input cannot display non-numeric
      characters, by specification. Libraries that format switch to{" "}
      <code>type="text"</code> and reimplement parsing, stepping, and
      validation by hand. blankjs keeps the real input and the platform
      behavior that comes with it; a formatted-input component is a different
      tool, not a missing feature of this one.
    </p>

    <h2>API</h2>

    <p>
      Every native <code>input</code> prop except <code>type</code> passes
      through — <code>min</code>, <code>max</code>, <code>step</code>,{" "}
      <code>required</code>, <code>placeholder</code>, and friends.
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
