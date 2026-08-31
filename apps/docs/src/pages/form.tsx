import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { FormBasic } from "../demos/form/basic";
import basicCode from "../demos/form/basic.tsx?raw";
import { FormSchema } from "../demos/form/schema";
import schemaCode from "../demos/form/schema.tsx?raw";

const serverErrorsCode = `
const [errors, setErrors] = useState<Record<string, string>>();

<Form
  errors={errors}
  onSubmit={async (data) => {
    const res = await send(serialize(data));
    if (!res.ok) setErrors(res.fieldErrors); // { username: "Already taken" }
  }}
>
  <Field.Root name="username">
    <TextInput name="username" />
    <Field.Error /> {/* shows "Already taken" */}
  </Field.Root>
</Form>
`;

const formErrorCode = `<Form error={declined ? "Card declined" : undefined}>
  <Form.Error /> {/* shows "Card declined" */}
  ...
</Form>
`;

const formErrorSchemaCode = `// no single share is wrong, only the total is
const schema = z
  .object({ design: z.coerce.number(), dev: z.coerce.number() })
  .refine((v) => v.design + v.dev === 100, "The shares must add up to 100");

<Form schema={schema} onSubmit={save}>
  <Form.Error />
  ...
</Form>
`;

const pathedRefineCode = `.refine((v) => v.password === v.confirm, {
  message: "Passwords do not match",
  path: ["confirm"], // lands under Confirm, and focus goes there
})
`;

const coercionCode = `
const schema = z.object({
  age: z.coerce.number(),        // "42" → 42
  newsletter: z.coerce.boolean(), // "on" → true, missing → false
});
`;

const fromYupCode = `
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { ValidationError, type AnySchema, type InferType } from "yup";

export const fromYup = <S extends AnySchema>(
  schema: S,
): StandardSchemaV1<unknown, InferType<S>> => ({
  "~standard": {
    version: 1,
    vendor: "yup",
    validate: async (value) => {
      try {
        return { value: await schema.validate(value, { abortEarly: false }) };
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err;

        const all = err.inner.length ? err.inner : [err];

        return {
          issues: all.map((e) => ({
            message: e.message,
            path: e.path ? [e.path] : undefined,
          })),
        };
      }
    },
  },
});

// <Form schema={fromYup(yupSchema)} onSubmit={…}>
`;

export const FormPage = () => (
  <article className="docs-page">
    <h1>Form</h1>

    <p className="docs-lead">
      A plain <code>&lt;form&gt;</code> with three additions:{" "}
      <code>FormData</code> in <code>onSubmit</code>, server errors routed to
      fields by name, and optional schema validation with full type inference.
      No form library, no controlled-state mirror.
    </p>

    <Demo code={basicCode}>
      <FormBasic />
    </Demo>

    <p>
      Values come from the DOM at submit time — every blankjs control renders
      a real form element (or a hidden input bound to one), so{" "}
      <code>new FormData(form)</code> simply works. <code>serialize</code>{" "}
      turns it into a plain object, collecting repeated names into arrays.
      Native constraints (<code>required</code>, <code>pattern</code>,
      <code>minLength</code>) run before <code>onSubmit</code> — the browser
      blocks invalid submits on its own.
    </p>

    <h2>Server errors</h2>

    <p>
      Pass <code>errors</code> keyed by field name — each{" "}
      <code>Field.Root</code> with a matching <code>name</code> turns invalid
      and shows the message in <code>Field.Error</code>. Editing the field
      dismisses its error; the next submit can bring it back. When errors
      arrive, the first matching control in DOM order is focused.
    </p>

    <CodeBlock code={serverErrorsCode} />

    <p>
      Keep <code>errors</code> in state, as above, and never write it inline as{" "}
      <code>errors=&#123;&#123; email: "Taken" &#125;&#125;</code>. A new object
      is what tells a field the server has spoken again, which is how the same
      message can reappear after the user edits the field. An object literal is
      new on every render, so a field would never manage to hide its message.
    </p>

    <h2>When no field is to blame</h2>

    <p>
      Most of what a submit can fail on belongs to some field, but not all of
      it. A card is declined, an account is locked, a rate limit is hit. Nothing
      on the form is wrong and there is nothing for <code>Field.Error</code> to
      key on. <code>Form.Error</code> is the slot for those.
    </p>

    <CodeBlock code={formErrorCode} />

    <p>
      It renders <code>role="alert"</code>, so a screen reader announces it the
      moment it appears. Nothing steals focus: the user pressed submit and is
      still on the button, and there is no single field to send them to.
    </p>

    <p>
      Unlike a field message, this one does not go away when the user edits
      something. No single field can answer for it, so it stays until the next
      submit replaces it or a reset clears it. The <code>error</code> prop is
      yours and outlives a reset, the same way <code>errors</code> does.
    </p>

    <h3>Give a cross-field rule a path</h3>

    <p>
      A schema issue that carries no path lands in the same slot. Reach for that
      rarely: most cross-field rules do have a field to blame, and naming it is
      the better answer.
    </p>

    <CodeBlock code={pathedRefineCode} />

    <p>
      A mismatched confirmation is the user's problem with <code>confirm</code>,
      so the message belongs under <code>confirm</code>, where the caret lands
      too. Leave the path off only when no single field is at fault:
    </p>

    <CodeBlock code={formErrorSchemaCode} />

    <p>
      If several path-less issues come back, the first one shows, matching how a
      field shows the first issue that names it.
    </p>

    <h2>While it submits</h2>

    <p>
      <code>onSubmit</code> may return a promise — schema validation already
      is one. While it is pending, the form ignores repeat submits (no
      double-click double-order) and renders a <code>data-submitting</code>{" "}
      attribute — style the pending state in CSS, no state of your own:
    </p>

    <CodeBlock
      code={`form[data-submitting] button[type="submit"] {
  opacity: 0.6;
  pointer-events: none;
}`}
      lang="css"
    />

    <p>
      The same flag is available as <code>submitting</code> on the form
      context for components that need it in JavaScript.
    </p>

    <h2>Typed and validated with a schema</h2>

    <p>
      Pass a <code>schema</code> and <code>onSubmit</code> receives the
      parsed, <strong>typed</strong> output instead of FormData. blankjs
      accepts any{" "}
      <a href="https://standardschema.dev" target="_blank" rel="noreferrer">
        Standard Schema
      </a>{" "}
      validator — Zod, Valibot, ArkType, Effect Schema — and depends on none
      of them: the schema is the only contact point.
    </p>

    <Demo code={schemaCode}>
      <FormSchema />
    </Demo>

    <p>
      Schema issues flow through the same pipeline as server errors: mapped to
      fields by their path, shown by <code>Field.Error</code>, dismissed on
      edit, and dropped entirely when the form is reset — the defaults are back,
      so messages about the old values describe nothing. An issue that names no
      field goes to <code>Form.Error</code> instead. The{" "}
      <code>errors</code> prop is yours and survives, since only you know
      whether it still applies. Cross-field rules work the same way — the{" "}
      <code>refine</code> above attaches its message to the{" "}
      <code>confirm</code> field. Async rules are awaited, so a{" "}
      <code>refine</code> that calls your API is fine.
    </p>

    <h2>Coerce your strings</h2>

    <p>
      FormData is stringly typed by nature: numbers arrive as{" "}
      <code>"42"</code>, checkboxes as <code>"on"</code>. Coerce them in the
      schema, or a <code>z.number()</code> will reject every submit:
    </p>

    <CodeBlock code={coercionCode} />

    <h2>Using a validator without Standard Schema support</h2>

    <p>
      Yup and Joi do not implement the spec, but wrapping one takes twenty
      lines. Copy, own, adjust:
    </p>

    <CodeBlock code={fromYupCode} />

    <h2>API</h2>

    <h3>Form</h3>

    <PropsTable
      props={[
        {
          name: "onSubmit",
          type: "(data, event) => void | Promise<void>",
          description:
            "Without a schema, data is the raw FormData. With a schema, data is the parsed output inferred from it. Default submit is prevented whenever onSubmit is set; a returned promise is awaited and guards against re-submits.",
        },
        {
          name: "schema",
          type: "StandardSchemaV1",
          description:
            "Any Standard Schema validator. Runs after native constraints pass; works in pair with onSubmit.",
        },
        {
          name: "errors",
          type: "Record<string, string>",
          description:
            "Server errors keyed by field name. Take precedence over schema errors on the same field. Keep it in state, not an inline literal.",
        },
        {
          name: "error",
          type: "string",
          description:
            "A message about the whole form, shown by Form.Error. Takes precedence over a path-less schema issue.",
        },
      ]}
    />

    <h3>Form.Error</h3>

    <p>
      Renders the form-level message, or nothing when there is none. Children
      override the message. It carries <code>role="alert"</code> unless you pass
      your own <code>role</code>. It keeps whatever <code>id</code> you give it,
      so your submit button can point at the message with{" "}
      <code>aria-describedby</code>.
    </p>

    <h3>serialize</h3>

    <p>
      <code>serialize(formData)</code> returns a plain object: single entries
      as values, repeated names as arrays, <code>File</code> values kept
      intact. Names written as paths — <code>address.city</code>,{" "}
      <code>guests[0].email</code> — come back nested, which is what{" "}
      <Link to="/components/field-array">FieldArray</Link> relies on. A name
      that only looks like a path, such as <code>price[USD]</code>, is left
      whole.
    </p>

    <p>
      Two rules for the awkward cases. A control named both ways —{" "}
      <code>guests</code> and <code>guests[0].email</code> in one form — is a
      naming conflict, and the nested value wins regardless of DOM order rather
      than whichever happened to be parsed last. And a segment called{" "}
      <code>__proto__</code>, <code>constructor</code> or{" "}
      <code>prototype</code> drops the entry instead of reaching the prototype
      chain, which matters when your field names come from a CMS.
    </p>

    <h2>Focus behavior</h2>

    <p>
      Whatever fails first gets focus: native constraint violations focus the
      first invalid control via the <code>invalid</code> event, schema
      failures focus the first control with an issue, and incoming server{" "}
      <code>errors</code> focus the first field they name — always in DOM
      order.
    </p>
  </article>
);
