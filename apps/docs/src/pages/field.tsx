import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { FieldBasic } from "../demos/field/basic";
import basicCode from "../demos/field/basic.tsx?raw";
import { FieldModes } from "../demos/field/modes";
import modesCode from "../demos/field/modes.tsx?raw";
import { FieldValidate } from "../demos/field/validate";
import validateCode from "../demos/field/validate.tsx?raw";
import { FieldCrossField } from "../demos/field/cross-field";
import crossFieldCode from "../demos/field/cross-field.tsx?raw";

const groupCode = `
<Field.Root>
  <Field.Label>Plan</Field.Label> {/* aria-labelledby, not htmlFor */}
  <RadioGroup.Root name="plan">
    <RadioGroup.Item value="free">Free</RadioGroup.Item>
    <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
  </RadioGroup.Root>
</Field.Root>
`;

const controlCode = `
<Field.Root>
  <Field.Label>Custom control</Field.Label>
  <Field.Control>
    <input className="my-input" name="custom" />
  </Field.Control>
  <Field.Error />
</Field.Root>
`;

const inlineCode = `
.my-checkbox-field {
  flex-direction: row;
  align-items: center;
}
`;

export const FieldPage = () => (
  <article className="docs-page">
    <h1>Field</h1>

    <p className="docs-lead">
      Connects a control to its label, description, and error text — and turns
      the browser's Constraint Validation API into declarative markup. No
      schema required, no state to wire.
    </p>

    <Demo code={basicCode}>
      <FieldBasic />
    </Demo>

    <p>
      The control gets <code>id</code>, <code>aria-describedby</code>,{" "}
      <code>aria-invalid</code>, <code>disabled</code>, and{" "}
      <code>required</code> from context — every blankjs control picks them up
      automatically. Native constraints (<code>required</code>,{" "}
      <code>type="email"</code>, <code>minLength</code>, <code>pattern</code>)
      report through <code>ValidityState</code>, and{" "}
      <code>errorMessages</code> swaps the browser's wording for your own, per
      constraint.
    </p>

    <h2>When errors appear</h2>

    <p>
      By default a field stays quiet until the form tries to submit: the
      browser fires <code>invalid</code>, Field intercepts it (suppressing the
      native bubble) and reveals the error. <code>validationMode</code> moves
      that moment earlier:
    </p>

    <ul className="docs-list">
      <li>
        <code>"submit"</code> (default) — reveal on the first blocked submit
      </li>
      <li>
        <code>"blur"</code> — reveal when the user leaves an invalid control
      </li>
      <li>
        <code>"change"</code> — reveal from the first keystroke
      </li>
    </ul>

    <p>
      Once revealed, the error updates live on every change regardless of
      mode — fix the value and it disappears immediately. A form{" "}
      <code>reset</code> puts the field back to quiet.
    </p>

    <Demo code={modesCode}>
      <FieldModes />
    </Demo>

    <h2>Custom rules</h2>

    <p>
      <code>validate</code> feeds <code>setCustomValidity</code>: return a
      message to fail, <code>null</code> to pass. The rule becomes a real
      native constraint — a failing value blocks submit exactly like{" "}
      <code>required</code> does, and reports through the{" "}
      <code>customError</code> validity flag.
    </p>

    <Demo code={validateCode}>
      <FieldValidate />
    </Demo>

    <p>
      The rule also receives the enclosing form's <code>FormData</code> as a
      second argument, so cross-field rules stay one-liners — the classic
      password confirmation, live on blur, no schema and no state:
    </p>

    <Demo code={crossFieldCode}>
      <FieldCrossField />
    </Demo>

    <h2>One error, your words</h2>

    <p>
      A field shows <strong>at most one error at a time</strong> — the same
      way the browser reports a single <code>validationMessage</code>. There
      is exactly one <code>&lt;Field.Error /&gt;</code> per field; what it
      says is configured where the rules live, on <code>Field.Root</code>:
    </p>

    <CodeBlock
      code={`<Field.Root
  required
  errorMessages={{
    valueMissing: "Enter a username",
    tooShort: "At least 4 characters",
  }}
>`}
    />

    <p>
      Keys are <code>ValidityState</code> flags (<code>valueMissing</code>,{" "}
      <code>typeMismatch</code>, <code>tooShort</code>,{" "}
      <code>patternMismatch</code>, <code>customError</code>, and friends);
      values are any <code>ReactNode</code>. When several flags are raised at
      once, <strong>the first matching key in the object wins</strong> — key
      order is the priority. The full message resolution:
    </p>

    <ul className="docs-list">
      <li>
        <code>Field.Error</code> children — a static text that always wins
      </li>
      <li>
        the first <code>errorMessages</code> entry whose flag is raised
      </li>
      <li>the server error, if the Form routed one to this field</li>
      <li>
        the browser's own message — localized to the user's language for free
      </li>
    </ul>

    <p>
      Messages for <code>validate</code>, schema rules, and server responses
      already travel with their rules — <code>errorMessages</code> exists for
      the native attributes, whose default wording belongs to the browser.
    </p>

    <h2>ValidityState reference</h2>

    <div className="docs-props-wrap">
      <table className="docs-props">
        <thead>
          <tr>
            <th>Flag</th>
            <th>Raised by</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>valueMissing</code>
            </td>
            <td>
              <code>required</code>
            </td>
            <td>
              Empty value; unchecked required checkbox; radio group with
              nothing selected.
            </td>
          </tr>
          <tr>
            <td>
              <code>typeMismatch</code>
            </td>
            <td>
              <code>type="email"</code> / <code>type="url"</code>
            </td>
            <td>
              The value does not parse as the type. Only these two types — a
              number field raises <code>badInput</code> instead.
            </td>
          </tr>
          <tr>
            <td>
              <code>patternMismatch</code>
            </td>
            <td>
              <code>pattern</code>
            </td>
            <td>
              The value does not match the regexp — matched against the{" "}
              <em>whole</em> value, as if wrapped in <code>^…$</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code>tooShort</code>
            </td>
            <td>
              <code>minLength</code>
            </td>
            <td>
              Shorter than the limit — but only after the user has edited the
              field. A programmatically set short value does not raise it.
            </td>
          </tr>
          <tr>
            <td>
              <code>tooLong</code>
            </td>
            <td>
              <code>maxLength</code>
            </td>
            <td>
              Rarely fires: the browser blocks typing past the limit. Only
              possible when the initial value already exceeds it.
            </td>
          </tr>
          <tr>
            <td>
              <code>rangeUnderflow</code> / <code>rangeOverflow</code>
            </td>
            <td>
              <code>min</code> / <code>max</code>
            </td>
            <td>Number, range, and date/time inputs outside the bounds.</td>
          </tr>
          <tr>
            <td>
              <code>stepMismatch</code>
            </td>
            <td>
              <code>step</code>
            </td>
            <td>
              Not a multiple of <code>step</code>, counted from{" "}
              <code>min</code>: <code>min=0 step=10</code> and a value of 37.
            </td>
          </tr>
          <tr>
            <td>
              <code>badInput</code>
            </td>
            <td>the input itself</td>
            <td>
              The browser cannot parse what was typed: letters in a number
              field, a half-typed date.
            </td>
          </tr>
          <tr>
            <td>
              <code>customError</code>
            </td>
            <td>
              <code>validate</code>
            </td>
            <td>
              Your rule returned a message. The message already travels with
              the rule — map this key only to replace it with richer content.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      Flags are not mutually exclusive — <code>"ab"</code> in a{" "}
      <code>required minLength=4 pattern="\d+"</code> input raises{" "}
      <code>tooShort</code> and <code>patternMismatch</code> at once, which is
      exactly why the key order of <code>errorMessages</code> matters.
    </p>

    <h2>Server errors</h2>

    <p>
      Give <code>Field.Root</code> a <code>name</code> and it picks up
      matching errors from the enclosing{" "}
      <Link to="/components/form">Form</Link>'s <code>errors</code> prop (or
      from a failed schema validation). Editing the field dismisses the error;
      the next server response can bring it back.
    </p>

    <h2>Group controls</h2>

    <p>
      A <code>div role="radiogroup"</code> is not a labelable element —{" "}
      <code>label htmlFor</code> silently does nothing. Field detects group
      controls like RadioGroup and switches the label wiring to{" "}
      <code>aria-labelledby</code> automatically:
    </p>

    <CodeBlock code={groupCode} />

    <h2>Custom controls</h2>

    <p>
      Any element can join a field. <code>Field.Control</code> is a slot that
      spreads the context props (<code>id</code>, <code>aria-describedby</code>
      , <code>aria-invalid</code>, <code>disabled</code>, <code>required</code>
      ) onto its child:
    </p>

    <CodeBlock code={controlCode} />

    <p>
      Building your own component? <code>useFieldControlProps()</code> from{" "}
      <code>@blankjs/core</code> returns the same props as a hook.
    </p>

    <h2>Layout</h2>

    <p>
      <code>Field.Root</code> is a flex column with a small gap — the standard
      label-control-error stack. For a horizontal field (checkbox with a label
      to its right), override the direction:
    </p>

    <CodeBlock code={inlineCode} lang="css" />

    <h2>API</h2>

    <h3>Field.Root</h3>

    <PropsTable
      props={[
        {
          name: "name",
          type: "string",
          description:
            "Links the field to server and schema errors keyed by this name.",
        },
        {
          name: "required",
          type: "boolean",
          defaultValue: "false",
          description: "Marks the control required through context.",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Disables the control through context.",
        },
        {
          name: "invalid",
          type: "boolean",
          description:
            "Forces the invalid state, overriding native validity. Useful for fully manual error handling.",
        },
        {
          name: "validationMode",
          type: '"submit" | "blur" | "change"',
          defaultValue: '"submit"',
          description: "When a hidden error is first revealed.",
        },
        {
          name: "validate",
          type: "(value: string, formData: FormData) => string | null | undefined",
          description:
            "Custom rule piped into setCustomValidity. A returned message blocks submit like a native constraint. formData holds the whole form for cross-field rules.",
        },
        {
          name: "errorMessages",
          type: "Partial<Record<keyof ValidityState, ReactNode>>",
          description:
            "Overrides for native constraint messages. Key order sets the priority when several flags are raised.",
        },
      ]}
    />

    <h3>Field.Error</h3>

    <p>
      No props of its own — renders when the field is invalid and there is
      something to say. Children replace the resolved message; with no
      resolvable text at all (a manual <code>invalid</code> without children)
      it renders nothing.
    </p>

    <h3>Field.Label / Field.Description / Field.Control</h3>

    <p>
      No props of their own — they register themselves and wire ARIA through
      context. <code>Field.Control</code> takes exactly one child element and
      spreads the control props onto it.
    </p>
  </article>
);
