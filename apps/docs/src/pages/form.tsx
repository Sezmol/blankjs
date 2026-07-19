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
      fields by the first path segment, shown by <code>Field.Error</code>,
      dismissed on edit. Cross-field rules work the same way — the{" "}
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
            "Server errors keyed by field name. Take precedence over schema errors on the same field.",
        },
      ]}
    />

    <h3>serialize</h3>

    <p>
      <code>serialize(formData)</code> returns a plain object: single entries
      as values, repeated names as arrays, <code>File</code> values kept
      intact.
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
