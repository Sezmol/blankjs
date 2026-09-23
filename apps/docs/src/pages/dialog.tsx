import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { DialogBasic } from "../demos/dialog/basic";
import basicCode from "../demos/dialog/basic.tsx?raw";
import { DialogForm } from "../demos/dialog/form";
import formCode from "../demos/dialog/form.tsx?raw";

const anatomyCode = `
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>…</Dialog.Title>
    <Dialog.Description>…</Dialog.Description>
    <Dialog.Close>Close</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
`;

export const DialogPage = () => (
  <article className="docs-page">
    <h1>Dialog</h1>

    <p className="docs-lead">
      A modal built on the native <code>&lt;dialog&gt;</code> element. The
      browser provides the focus trap, focus return, <code>Escape</code>{" "}
      handling, and the backdrop.
    </p>

    <Demo code={basicCode}>
      <DialogBasic />
    </Demo>

    <h2>Built on the platform</h2>

    <p>
      <code>Dialog.Content</code> renders a real <code>&lt;dialog&gt;</code>{" "}
      and opens it with <code>showModal()</code>. That call gives you what
      other libraries rebuild by hand:
    </p>

    <ul className="docs-list">
      <li>
        <strong>Top layer.</strong> The dialog paints above the page
        regardless of <code>z-index</code> or ancestor{" "}
        <code>overflow: hidden</code>. It needs no portal and stays where you
        wrote it in the tree.
      </li>
      <li>
        <strong>Focus trap and focus return.</strong> Tab cycles inside the
        open dialog; closing it hands focus back to the trigger.
      </li>
      <li>
        <strong>Escape.</strong> The browser fires a <code>cancel</code>{" "}
        event; the library routes it through state so controlled dialogs stay
        in sync.
      </li>
      <li>
        <strong>Backdrop.</strong> <code>::backdrop</code> is a real
        pseudo-element you can restyle with CSS. Clicking it closes the
        dialog.
      </li>
      <li>
        <strong>Scroll lock.</strong> A CSS rule (
        <code>html:has(dialog:modal)</code>) locks page scroll, and{" "}
        <code>scrollbar-gutter: stable</code> keeps the layout from jumping.
      </li>
    </ul>

    <h2>Anatomy</h2>

    <CodeBlock code={anatomyCode} />

    <p>
      <code>Dialog.Title</code> and <code>Dialog.Description</code> wire{" "}
      <code>aria-labelledby</code> / <code>aria-describedby</code> onto the
      dialog. Leave one out and the dialog drops that attribute too. The
      layout inside the dialog is yours: rows of action buttons, dividers,
      any structure you need.
    </p>

    <h2>With a form</h2>

    <p>
      Forms work inside: fields validate, <code>FormData</code> serializes,
      and the demo controls the dialog so submit can close it.
    </p>

    <Demo code={formCode}>
      <DialogForm />
    </Demo>

    <h2>Vetoing a close</h2>

    <p>
      The standard event contract applies. To keep the dialog open, for
      example with unsaved changes, call <code>preventDefault()</code> in{" "}
      <code>onCancel</code> for <code>Escape</code>, or in{" "}
      <code>onClick</code> of <code>Dialog.Close</code>:
    </p>

    <CodeBlock
      code={`<Dialog.Content onCancel={(e) => {
  if (hasUnsavedChanges) e.preventDefault(); // Escape ignored
}}>`}
    />

    <h2>API</h2>

    <h3>Dialog.Root</h3>

    <PropsTable
      props={[
        {
          name: "open",
          type: "boolean",
          description: "Controlled open state.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          defaultValue: "false",
          description: "Whether the dialog starts open in uncontrolled mode.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Called when the dialog opens or closes.",
        },
      ]}
    />

    <h3>Dialog.Trigger</h3>

    <PropsTable
      props={[
        {
          name: "asChild",
          type: "boolean",
          defaultValue: "false",
          description:
            "Renders the child element instead of the built-in button, merging trigger props onto it.",
        },
      ]}
    />

    <h3>Dialog.Content</h3>

    <p>
      Accepts every native <code>&lt;dialog&gt;</code> prop.{" "}
      <code>preventDefault()</code> in <code>onCancel</code> vetoes closing
      on <code>Escape</code>; <code>preventDefault()</code> in{" "}
      <code>onClick</code> vetoes closing on a backdrop click.
    </p>

    <h3>Dialog.Close</h3>

    <p>
      A button that closes the dialog. Accepts every native button prop;{" "}
      <code>preventDefault()</code> in your <code>onClick</code> vetoes the
      close.
    </p>

    <h3>Dialog.Title / Dialog.Description</h3>

    <p>
      Render an <code>h2</code> and a <code>div</code>, and register
      themselves so the dialog gets <code>aria-labelledby</code> and{" "}
      <code>aria-describedby</code>. No props beyond the native ones.
    </p>

    <h2>Closing interactions</h2>

    <div className="docs-props-wrap">
      <table className="docs-props">
        <thead>
          <tr>
            <th>Interaction</th>
            <th>Veto point</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>Escape</code>
            </td>
            <td>
              <code>onCancel</code> on <code>Dialog.Content</code>
            </td>
          </tr>
          <tr>
            <td>Backdrop click</td>
            <td>
              <code>onClick</code> on <code>Dialog.Content</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Dialog.Close</code> click
            </td>
            <td>
              <code>onClick</code> on <code>Dialog.Close</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
);
