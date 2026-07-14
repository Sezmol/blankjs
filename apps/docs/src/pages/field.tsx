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
      report through <code>ValidityState</code>, and each{" "}
      <code>Field.Error match</code> renders only when its flag is raised.
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

    <h2>Matching specific constraints</h2>

    <p>
      <code>match</code> takes any <code>ValidityState</code> key:{" "}
      <code>valueMissing</code>, <code>typeMismatch</code>,{" "}
      <code>tooShort</code>, <code>patternMismatch</code>,{" "}
      <code>rangeUnderflow</code>, <code>customError</code>, and friends. Two
      fallbacks:
    </p>

    <ul className="docs-list">
      <li>
        <code>&lt;Field.Error /&gt;</code> without <code>match</code> shows
        whenever the field is invalid
      </li>
      <li>
        <code>&lt;Field.Error /&gt;</code> without children renders the
        browser's own message — localized to the user's language for free
      </li>
    </ul>

    <p>
      Each <code>Field.Error</code> decides its visibility{" "}
      <strong>independently</strong> — there is no coordination between them.
      Pick one strategy per field: either a set of mutually exclusive{" "}
      <code>match</code> branches, or a single catch-all. Mixing both renders
      the catch-all <em>alongside</em> a matched branch and duplicates the
      message.
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
          type: "(value: string) => string | null | undefined",
          description:
            "Custom rule piped into setCustomValidity. A returned message blocks submit like a native constraint.",
        },
      ]}
    />

    <h3>Field.Error</h3>

    <PropsTable
      props={[
        {
          name: "match",
          type: "keyof ValidityState",
          description:
            "Renders only when this validity flag is raised. Without it, renders whenever the field is invalid.",
        },
      ]}
    />

    <h3>Field.Label / Field.Description / Field.Control</h3>

    <p>
      No props of their own — they register themselves and wire ARIA through
      context. <code>Field.Control</code> takes exactly one child element and
      spreads the control props onto it.
    </p>
  </article>
);
