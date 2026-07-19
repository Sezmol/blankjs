import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { PasswordFieldBasic } from "../demos/password-field/basic";
import basicCode from "../demos/password-field/basic.tsx?raw";
import { PasswordFieldValidation } from "../demos/password-field/validation";
import validationCode from "../demos/password-field/validation.tsx?raw";

export const PasswordFieldPage = () => (
  <article className="docs-page">
    <h1>PasswordField</h1>

    <p className="docs-lead">
      A password input with the one thing passwords actually need on top: a
      visibility toggle that does not fight the browser.
    </p>

    <Demo code={basicCode}>
      <PasswordFieldBasic />
    </Demo>

    <h2>How the toggle behaves</h2>

    <ul className="docs-list">
      <li>
        Revealing swaps <code>type="password"</code> for{" "}
        <code>type="text"</code> — the value, caret, and undo history stay
        put.
      </li>
      <li>
        Clicking the eye never steals focus from the input (a{" "}
        <code>mousedown</code> is prevented), so the user can toggle
        mid-typing and keep typing.
      </li>
      <li>
        The button announces itself as "Show password" / "Hide password" —
        state lives in the label, no <code>aria-pressed</code> to
        misinterpret.
      </li>
      <li>
        The toggle is <code>type="button"</code> and disables together with
        the input.
      </li>
    </ul>

    <h2>Validation</h2>

    <p>
      <code>required</code> and <code>minLength</code> are native
      constraints, so the <Link to="/components/field">Field</Link> pipeline
      applies unchanged:
    </p>

    <Demo code={validationCode}>
      <PasswordFieldValidation />
    </Demo>

    <h2>API</h2>

    <PropsTable
      props={[
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Input and toggle size.",
        },
      ]}
    />

    <p>
      Every native <code>input</code> prop except <code>type</code> passes
      through — the type belongs to the toggle. Pair it with{" "}
      <code>autoComplete="current-password"</code> or{" "}
      <code>"new-password"</code> so password managers do the right thing.
    </p>
  </article>
);
