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
      fields by name, and optional schema validation with type inference. You
      need no form library and no controlled copy of the values.
    </p>

    <Demo code={basicCode}>
      <FormBasic />
    </Demo>

    <p>
      Form reads the values from the DOM at submit time. Every blankjs control
      renders a real form element or a hidden input bound to one, so{" "}
      <code>new FormData(form)</code> works. <code>serialize</code> turns it
      into a plain object and collects repeated names into arrays. Native
      constraints (<code>required</code>, <code>pattern</code>,{" "}
      <code>minLength</code>) run before <code>onSubmit</code>, and the
      browser blocks invalid submits by itself.
    </p>

    <h2>Server errors</h2>

    <p>
      Pass <code>errors</code> keyed by field name. Each{" "}
      <code>Field.Root</code> with a matching <code>name</code> turns invalid
      and shows the message in <code>Field.Error</code>. Editing the field
      dismisses its error, and the next submit can bring it back. When errors
      arrive, Form focuses the first matching control in DOM order.
    </p>

    <CodeBlock code={serverErrorsCode} />

    <p>
      Keep <code>errors</code> in state, as above. Do not write it inline as{" "}
      <code>errors=&#123;&#123; email: "Taken" &#125;&#125;</code>. Form treats
      a new object as a new server answer, so the same message can come back
      after the user edits the field. An inline literal is a new object on
      every render, and the field could never hide its message.
    </p>

    <h2>Errors without a field</h2>

    <p>
      Most submit failures belong to a field. A declined card, a locked
      account or a rate limit belongs to none: nothing on the form is wrong,
      and <code>Field.Error</code> has no name to match.{" "}
      <code>Form.Error</code> shows these.
    </p>

    <CodeBlock code={formErrorCode} />

    <p>
      It renders <code>role="alert"</code>, so a screen reader announces it as
      soon as it appears. Focus stays where it is: the user pressed submit and
      is still on the button, and no single field needs their attention.
    </p>

    <p>
      A field message goes away when the user edits the field. This one stays,
      because no single edit can fix it: the next submit replaces it, or a
      reset clears it. The <code>error</code> prop is yours and outlives a
      reset, the same way <code>errors</code> does.
    </p>

    <h3>Give a cross-field rule a path</h3>

    <p>
      A schema issue without a path lands in the same slot. Use that rarely:
      most cross-field rules have a field to blame, and the message belongs
      there.
    </p>

    <CodeBlock code={pathedRefineCode} />

    <p>
      A mismatched confirmation is a problem with <code>confirm</code>, so the
      message goes under <code>confirm</code>, and focus moves there too. Leave
      the path off only when no single field is at fault:
    </p>

    <CodeBlock code={formErrorSchemaCode} />

    <p>
      If several path-less issues come back, the first one shows, matching how a
      field shows the first issue that names it.
    </p>

    <h2>While it submits</h2>

    <p>
      <code>onSubmit</code> may return a promise, and schema validation is
      async anyway. While the promise is pending, the form ignores repeat
      submits, so a double click cannot place two orders. It also sets a{" "}
      <code>data-submitting</code> attribute, so you can style the pending
      state in CSS without state of your own:
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
      parsed, <strong>typed</strong> output in place of FormData. blankjs
      accepts any{" "}
      <a href="https://standardschema.dev" target="_blank" rel="noreferrer">
        Standard Schema
      </a>{" "}
      validator, such as Zod, Valibot, ArkType or Effect Schema, and depends
      on none of them.
    </p>

    <Demo code={schemaCode}>
      <FormSchema />
    </Demo>

    <p>
      Schema issues go through the same pipeline as server errors. Form maps
      them to fields by path, <code>Field.Error</code> shows them, and an edit
      dismisses them. A form reset drops them, because the defaults are back
      and messages about the old values no longer apply. An issue that names
      no field goes to <code>Form.Error</code>. The <code>errors</code> prop
      is yours and survives a reset, since only you know whether it still
      applies. Cross-field rules work the same way: the <code>refine</code>{" "}
      above attaches its message to the <code>confirm</code> field. Form
      awaits async rules, so a <code>refine</code> that calls your API
      works.
    </p>

    <h2>Coerce your strings</h2>

    <p>
      FormData values are strings: numbers arrive as <code>"42"</code>,
      checkboxes as <code>"on"</code>. Coerce them in the schema, or a{" "}
      <code>z.number()</code> rejects every submit:
    </p>

    <CodeBlock code={coercionCode} />

    <h2>Using a validator without Standard Schema support</h2>

    <p>
      Yup and Joi do not implement the spec, and a wrapper takes about twenty
      lines. Copy it into your project and adjust:
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
            "Any Standard Schema validator. Runs after native constraints pass, and only together with onSubmit.",
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
      intact. Names written as paths, like <code>address.city</code> or{" "}
      <code>guests[0].email</code>, come back nested.{" "}
      <Link to="/components/field-array">FieldArray</Link> relies on this. A
      name that only looks like a path, such as <code>price[USD]</code>, stays
      whole.
    </p>

    <p>
      Two edge cases. A name used both ways, <code>guests</code> and{" "}
      <code>guests[0].email</code> in one form, is a naming conflict: the
      nested value wins regardless of DOM order. A segment called{" "}
      <code>__proto__</code>, <code>constructor</code> or{" "}
      <code>prototype</code> drops the entry and never reaches the prototype
      chain, which matters when your field names come from a CMS.
    </p>

    <h2>Focus behavior</h2>

    <p>
      Form sends focus to the first failure in DOM order. On a submit attempt,
      native constraint violations focus the first invalid control through
      the <code>invalid</code> event, and schema failures focus the first
      control with an issue. Incoming server <code>errors</code> focus the
      first field they name.
    </p>
  </article>
);
