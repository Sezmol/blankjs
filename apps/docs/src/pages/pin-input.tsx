import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { PinInputBasic } from "../demos/pin-input/basic";
import basicCode from "../demos/pin-input/basic.tsx?raw";
import { PinInputVerify } from "../demos/pin-input/verify";
import verifyCode from "../demos/pin-input/verify.tsx?raw";
import { PinInputHeadless } from "../demos/pin-input/headless";
import headlessCode from "../demos/pin-input/headless.tsx?raw";

const anatomyCode = `<div role="group">          {/* labelled by the Field label */}
  <input class="bk-pin-input-cell" />   {/* one per length */}
  <input class="bk-pin-input-cell" />
  …
  <input name="code" />     {/* the form proxy, hidden with CSS */}
</div>
`;

const groupsCode = `<PinInput name="code" length={6} groups={[3, 3]} />
<PinInput name="code" length={6} groups={[2, 2, 2]} separator="·" />
`;

const completeCode = `<PinInput
  name="code"
  length={6}
  onComplete={(code) => verify(code)}
/>
`;

export const PinInputPage = () => (
  <article className="docs-page">
    <h1>PinInput</h1>

    <p className="docs-lead">
      A verification code split into cells. Each cell is a real input, so the
      caret, the mobile keyboard and the browser's own text handling are the
      platform's. The code itself reaches the form as one value.
    </p>

    <Demo code={basicCode}>
      <PinInputBasic />
    </Demo>

    <h2>What the markup is</h2>

    <CodeBlock code={anatomyCode} />

    <p>
      The cells are what you type into. Alongside them sits one more input,
      hidden with CSS rather than <code>type="hidden"</code>, carrying the
      joined value under your <code>name</code>. The distinction matters:{" "}
      <code>type="hidden"</code> is barred from constraint validation, so a
      hidden proxy could never be <code>required</code>. This one can, which is
      how an incomplete code blocks a submit without a line of JavaScript. The
      same trick runs Select, Combobox and MultiSelect.
    </p>

    <h2>Validation</h2>

    <p>
      The proxy carries a <code>pattern</code> built from{" "}
      <code>length</code> and <code>type</code>, so a half-typed code is invalid
      the same way a malformed email is. Mark the{" "}
      <Link to="/components/field">Field</Link> as <code>required</code> and{" "}
      <code>Field.Error</code> reports it. When the browser rejects the value it
      would normally focus the proxy, which nobody can see; focus is handed to
      the first empty cell instead.
    </p>

    <Demo code={verifyCode}>
      <PinInputVerify />
    </Demo>

    <h2>Grouping</h2>

    <p>
      <code>groups</code> splits the cells and draws a separator between the
      pieces. Numbers that do not add up to <code>length</code> are fine, the
      leftover cells join the last group rather than disappearing.
    </p>

    <CodeBlock code={groupsCode} />

    <h2>Reacting to a finished code</h2>

    <p>
      <code>onComplete</code> fires when the last cell fills, whether the code
      was typed, pasted or autofilled. It is the hook for verifying without a
      submit button.
    </p>

    <CodeBlock code={completeCode} />

    <h2>What the browser does for us</h2>

    <p>
      Pasting <code>123-456</code> drops the separator and spreads the digits.
      Autofill from an SMS arrives as one long value in the first cell and
      spreads the same way, which is why the cells accept more than one
      character even though they only ever show one. The first cell carries{" "}
      <code>autocomplete="one-time-code"</code>; the rest carry{" "}
      <code>off</code>, so a password manager cannot scatter a saved value
      across them.
    </p>

    <p>
      The browser never edits a cell itself. Every insertion is taken on{" "}
      <code>beforeinput</code> and written by the component, so a cell always
      shows exactly what was rendered. That is what makes typing into a filled
      cell replace the character rather than be swallowed, and a character the{" "}
      <code>type</code> rejects never reaches the DOM at all. It also keeps the
      value safe from a re-render landing mid-keystroke, which would otherwise
      reset the cell and lose the character before React saw it.
    </p>

    <h2>No holes</h2>

    <p>
      Cells fill from the left. Clicking a cell past the end sends focus to the
      first empty one, so the value is always a prefix and never{" "}
      <code>1_3___</code>. This is what keeps <code>value</code> a plain string:
      a hole would have to vanish when the characters are joined, and a
      controlled parent feeding that string back would move the gap.
    </p>

    <h2>Driving it yourself</h2>

    <p>
      <code>usePinInput</code> is the same logic with no markup, exported from{" "}
      <code>@blankjs/core</code> and re-exported here.{" "}
      <code>getCellProps(index)</code> hands you the value, the handlers and the
      ref for one cell; everything around them is yours. There is no form proxy
      and no validation in the hook, so add your own input if you need one.
    </p>

    <Demo code={headlessCode}>
      <PinInputHeadless />
    </Demo>

    <h2>API</h2>

    <h3>PinInput</h3>

    <PropsTable
      props={[
        {
          name: "name",
          type: "string",
          description:
            "Name of the hidden proxy input, which is what lands in FormData as the joined code.",
        },
        {
          name: "length",
          type: "number",
          defaultValue: "6",
          description: "How many cells to render.",
        },
        {
          name: "groups",
          type: "number[]",
          description:
            "Splits the cells into groups with a separator between them, for example [3, 3]. Leftover cells join the last group.",
        },
        {
          name: "separator",
          type: "ReactNode",
          description:
            "What to render between groups. Defaults to a dash drawn in CSS.",
        },
        {
          name: "type",
          type: '"numeric" | "alphanumeric"',
          defaultValue: '"numeric"',
          description:
            "Which characters are accepted, and what the validation pattern and inputMode are built from.",
        },
        {
          name: "mask",
          type: "boolean",
          description: "Renders the cells as password inputs.",
        },
        {
          name: "placeholder",
          type: "string",
          description: "Shown in every empty cell.",
        },
        {
          name: "value / defaultValue",
          type: "string",
          description:
            "The whole code. Characters the type rejects are dropped, and anything past length is trimmed.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Fires on every change.",
        },
        {
          name: "onComplete",
          type: "(value: string) => void",
          description: "Fires when the last cell fills.",
        },
        {
          name: "required",
          type: "boolean",
          description:
            "Falls back to the Field. An incomplete code is invalid whenever this is set.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Falls back to the Field. Reaches every cell.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Cell size.",
        },
      ]}
    />

    <h3>usePinInput</h3>

    <PropsTable
      props={[
        {
          name: "value",
          type: "string",
          description: "The joined code.",
        },
        {
          name: "chars",
          type: "string[]",
          description:
            "One entry per cell, empty string for the ones not reached yet.",
        },
        {
          name: "complete",
          type: "boolean",
          description: "True once every cell is filled.",
        },
        {
          name: "pattern",
          type: "string",
          description:
            "The regular expression source for a full code, ready for a pattern attribute.",
        },
        {
          name: "getCellProps",
          type: "(index: number) => props",
          description:
            "Value, ref and handlers for one cell. Spread it onto your own input.",
        },
        {
          name: "setValue / clear",
          type: "(value: string) => void / () => void",
          description: "Replace or empty the whole code.",
        },
        {
          name: "focus",
          type: "(index?: number) => void",
          description: "Focus a cell, clamped to the range.",
        },
      ]}
    />
  </article>
);
