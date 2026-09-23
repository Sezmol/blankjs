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
      A password input with a visibility toggle that leaves the browser's
      input behavior alone.
    </p>

    <Demo code={basicCode}>
      <PasswordFieldBasic />
    </Demo>

    <h2>Toggle behavior</h2>

    <ul className="docs-list">
      <li>
        Revealing swaps <code>type="password"</code> for{" "}
        <code>type="text"</code>. The value, caret, and undo history stay put.
      </li>
      <li>
        Clicking the eye keeps focus in the input (the toggle prevents{" "}
        <code>mousedown</code>), so the user can toggle mid-typing and keep
        typing.
      </li>
      <li>
        Screen readers announce the button as "Show password" or "Hide
        password". The label carries the state, so there is no{" "}
        <code>aria-pressed</code> to misread.
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
      PasswordField passes through every native <code>input</code> prop
      except <code>type</code>, which the toggle controls. Pair it with{" "}
      <code>autoComplete="current-password"</code> or{" "}
      <code>"new-password"</code> so password managers know whether to fill a
      saved password or suggest a new one.
    </p>
  </article>
);
