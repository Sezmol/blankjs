import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { FieldArrayBasic } from "../demos/field-array/basic";
import basicCode from "../demos/field-array/basic.tsx?raw";
import { FieldArraySchema } from "../demos/field-array/schema";
import schemaCode from "../demos/field-array/schema.tsx?raw";
import { FieldArrayHeadless } from "../demos/field-array/headless";
import headlessCode from "../demos/field-array/headless.tsx?raw";

const namesCode = `<TextInput name="guests[0].email" />
<TextInput name="guests[1].email" />

// serialize(formData)
{ guests: [{ email: "…" }, { email: "…" }] }
`;

const keyCode = `{rows.map((row) => (
  <div key={row.key}>          {/* stable for the life of the row */}
    <TextInput name={row.name("email")} />   {/* guests[0].email */}
    <span>Guest {row.position}</span>        {/* 1, 2, 3 … */}
  </div>
))}
`;

const typingCode = `// inferred from defaultItems
<FieldArray name="guests" defaultItems={invited}>
  {({ rows }) => rows.map((row) => (
    <TextInput name={row.name("email")} defaultValue={row.item?.email} />
    //                       ^ "name" | "email"
  ))}

// nothing to infer from, so name the row type and keep the schema in charge
type Teammate = z.infer<typeof schema>["team"][number];

<FieldArray<Teammate> name="team">

// no type at all: names stay open strings, nothing is checked
<FieldArray name="tags">
`;

const nestedCode = `<FieldArray name="guests">
  {({ rows }) => rows.map((row) => (
    <FieldArray key={row.key} name={row.name("meals")}>
      {(meals) => meals.rows.map((meal) => (
        <TextInput key={meal.key} name={meal.name()} />
      ))}
    </FieldArray>
  ))}
</FieldArray>

// guests[0].meals[0], guests[0].meals[1], guests[1].meals[0] …
`;

export const FieldArrayPage = () => (
  <article className="docs-page">
    <h1>FieldArray</h1>

    <p className="docs-lead">
      A repeating group of fields, such as guests, line items or phone
      numbers. The rows are React state. The values stay in the DOM, as
      everywhere else in blankjs, so you keep no array of values in sync.
    </p>

    <Demo code={basicCode}>
      <FieldArrayBasic />
    </Demo>

    <h2>Names</h2>

    <p>
      Each row gets an index, and <code>row.name(field)</code> builds the{" "}
      <code>name</code> attribute from it. On submit,{" "}
      <code>serialize</code> reads those names back into nested data. The
      notation is the same <code>array[index].property</code> that Rails, PHP
      and Zod use:
    </p>

    <CodeBlock code={namesCode} />

    <p>
      A row without fields of its own uses <code>row.name()</code> and produces{" "}
      <code>tags[0]</code>, giving a plain array of strings.
    </p>

    <h2>Key and index</h2>

    <p>
      Mixing these two up is a common source of form bugs.{" "}
      <code>row.key</code> is opaque and belongs to the row for as long as the
      row exists. The index inside the name is the row's{" "}
      <em>current position</em>, and it changes when a row above is removed.
    </p>

    <p>
      Use <code>row.key</code> as the React key and for nothing else. If you
      key by position, React reuses the DOM node of the deleted row and the
      values below it shift up by one. With uncontrolled inputs, the user sees
      data move between rows. Keys are prefixed strings like <code>r3</code>{" "}
      so nobody mistakes them for a position. For labels use{" "}
      <code>row.position</code>, counted from 1:
    </p>

    <CodeBlock code={keyCode} />

    <h2>Validation</h2>

    <p>
      Schema issues carry the full path, so an issue on{" "}
      <code>["team", 1, "email"]</code> lands on the{" "}
      <code>Field.Root</code> named <code>team[1].email</code>: the second row
      turns invalid and the rest stay clean. An issue on the array itself,
      like a <code>min(2)</code>, belongs to no row, and{" "}
      <code>FieldArray.Error</code> renders it.
    </p>

    <Demo code={schemaCode}>
      <FieldArraySchema />
    </Demo>

    <p>
      Removing, inserting or moving a row drops that array's schema errors.
      Otherwise, after you delete the first row, <code>team[1].email</code>{" "}
      would point at a different person. Appending is the exception: it puts a
      row at the end and renumbers nothing, so the messages you still need
      stay on screen. Append dismisses only the array-level error, since
      adding a row is likely the answer to it.
    </p>

    <p>
      FieldArray leaves server errors from <code>errors</code> alone; they are
      yours and clear on the next response. A form reset drops schema errors
      across the whole form and puts the rows back to{" "}
      <code>defaultItems</code>. These rules hold whether you use a part or
      the operation from the render prop.
    </p>

    <h2>Focus</h2>

    <p>
      <code>FieldArray.Add</code> appends a row and moves focus into its first
      control, so you can keep typing. <code>FieldArray.Remove</code> moves
      focus to the next row's remove button, then to the previous one, then to
      the add button. Without that, focus would land on{" "}
      <code>&lt;body&gt;</code> and keyboard users would lose their place.
    </p>

    <p>
      Focus only moves when it was inside the row that went away. A "clear all"
      button somewhere else on the page will not steal it.
    </p>

    <h2>Nesting</h2>

    <p>
      An inner array takes the outer row's name as its own. Buttons and focus
      stay scoped to their own array.
    </p>

    <CodeBlock code={nestedCode} />

    <h2>Left out on purpose</h2>

    <p>
      Other libraries ship <code>update</code> and <code>replace</code>. Those
      need a value store, and here the DOM is the store: the input holds the
      value, and FieldArray has nothing to overwrite. The operations that
      remain change the <em>shape</em> of the list:{" "}
      <code>append</code>, <code>insert</code>, <code>remove</code>,{" "}
      <code>move</code>.
    </p>

    <p>
      For the same reason there is no <code>values</code> to read while typing.
      If you need a running total, read it from the DOM on{" "}
      <code>input</code>.
    </p>

    <h2>Driving it yourself</h2>

    <p>
      <code>FieldArray</code> is a thin shell over <code>useFieldArray</code>,
      which lives in <code>@blankjs/core</code>. The React package re-exports
      it, so you need no second install. The hook holds only state and knows
      nothing about the DOM. When the parts get in the way of your markup,
      take the hook and render whatever you like. Our components still work;
      you drop only the wrapper.
    </p>

    <p>
      This demo is an <code>&lt;ol&gt;</code> with reordering. The parts do not
      cover it, because <code>move</code> lives on the hook and has no button
      component:
    </p>

    <Demo code={headlessCode}>
      <FieldArrayHeadless />
    </Demo>

    <p>
      Reordering keeps focus by itself: rows are keyed, so React moves the
      element and whatever was focused travels with it.
    </p>

    <p>
      Without the parts you handle four things yourself. They are the reason
      the parts exist:
    </p>

    <ul className="docs-list">
      <li>
        <strong>Focus.</strong> The hook does not move focus. After the{" "}
        <code>remove</code> above, focus falls to <code>&lt;body&gt;</code>.
        The demo leaves this rough edge in on purpose.
      </li>
      <li>
        <strong>Form reset.</strong> The hook has <code>reset()</code>, but
        nothing calls it, so the rows stay as they are while every input in
        them goes back to its default. Listen for <code>reset</code> on the{" "}
        <code>&lt;form&gt;</code> yourself.
      </li>
      <li>
        <strong>Stale errors.</strong> Removing, inserting or moving a row
        renumbers the ones below it, so <code>steps[1].text</code> starts
        pointing at a different row. The wrapper clears the array's schema
        errors on those three operations.
      </li>
      <li>
        <strong>Array-level errors.</strong> You look the message up by name
        and wire <code>aria-describedby</code> yourself.
      </li>
    </ul>

    <p>
      One more if you use <code>@blankjs/core</code> without our React
      package: <code>serialize</code> lives in <code>@blankjs/react</code>, so
      nothing turns <code>steps[0].text</code> back into nested data on the
      client. That is often fine: Rails, PHP and most form-body parsers read
      this notation, and the server does the parsing anyway.
    </p>

    <h2>API</h2>

    <h3>Typing the rows</h3>

    <p>
      A row type does two things: it types <code>row.item</code>, and it
      narrows <code>row.name()</code> to that row's own fields. The narrowing
      matters more. Without it <code>row.name("emial")</code> is a valid
      string that produces <code>team[0].emial</code>, and all you see is the
      schema complaining that <code>email</code> is missing.
    </p>

    <p>
      TypeScript infers the type from <code>defaultItems</code>, so when you
      pass them, skip writing it:
    </p>

    <CodeBlock code={typingCode} />

    <p>
      Write it by hand when there is nothing to infer from, as the validation
      demo above does. Deriving it from the schema keeps the shape
      in one place, checks every <code>name()</code> call, and turns a later{" "}
      <code>defaultItems</code> of the wrong shape into a type error.
    </p>

    <p>
      Derive the right type.{" "}
      <code>FieldArray&lt;z.infer&lt;typeof schema&gt;&gt;</code> looks
      plausible but names the whole form object, so <code>name()</code> would
      accept <code>"team"</code> and reject{" "}
      <code>"email"</code>. The row is one element:{" "}
      <code>z.infer&lt;typeof schema&gt;["team"][number]</code>.
    </p>

    <p>
      The narrowing has two gaps. Seed data that carries only some of a row's
      fields infers only those keys: type it as{" "}
      <code>Partial&lt;Row&gt;[]</code> or name <code>Row</code> explicitly. A
      field nested inside a row takes two steps; compose it:{" "}
      <code>{"`${row.name(\"address\")}.city`"}</code>.
    </p>

    <h3>FieldArray</h3>

    <PropsTable
      props={[
        {
          name: "<T>",
          type: "type parameter",
          description:
            "The shape of one row: what row.item holds and which field names row.name() accepts. Inferred from defaultItems; see Typing the rows above before writing it by hand.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Base for every generated name and the key an array-level error is looked up by.",
        },
        {
          name: "defaultItems",
          type: "readonly T[]",
          description:
            "Seeds one row per entry and hands each entry back as row.item, for defaultValue. Also what T is inferred from. One empty row when omitted; an empty array renders no rows. Read once, like defaultValue: data that arrives later from a fetch changes nothing, so mount the form after the data is there, or give it a key.",
        },
        {
          name: "minItems",
          type: "number",
          description:
            "Floor for removal: Remove is disabled at this size. Also pads the initial rows.",
        },
        {
          name: "maxItems",
          type: "number",
          description: "Ceiling for appending: Add is disabled at this size.",
        },
        {
          name: "children",
          type: "(array) => ReactNode",
          description:
            "Render prop. Receives rows, append, insert, remove, move, reset, canAppend, canRemove.",
        },
      ]}
    />

    <h3>row</h3>

    <PropsTable
      props={[
        {
          name: "key",
          type: "string",
          description: "React key. Stable for the lifetime of the row.",
        },
        {
          name: "position",
          type: "number",
          description: "1-based position, for labels. Never use it as a key.",
        },
        {
          name: "item",
          type: "T | undefined",
          description:
            "The defaultItems entry this row was seeded with; undefined for rows added later, and for every row when defaultItems is omitted.",
        },
        {
          name: "name",
          type: "(field?: keyof T) => string",
          description:
            'name("email") → guests[0].email, name() → guests[0]. The argument is narrowed to the row\'s fields once T is known, and stays an open string when it is not.',
        },
      ]}
    />

    <h3>FieldArray.Add / FieldArray.Remove</h3>

    <p>
      Buttons that carry the behavior: the list operation, the disabled state
      from <code>minItems</code>/<code>maxItems</code>, and the focus move.{" "}
      <code>Remove</code> takes the <code>row</code> it belongs to. Both accept{" "}
      <code>asChild</code> to render your own button, and calling{" "}
      <code>preventDefault</code> in your <code>onClick</code> cancels the
      operation.
    </p>

    <h3>FieldArray.Error</h3>

    <p>
      Renders the error keyed by the array's <code>name</code>: the
      array-level schema issue or a matching entry in the form's{" "}
      <code>errors</code>. See{" "}
      <Link to="/components/form">Form</Link> for how errors reach it.
    </p>
  </article>
);
