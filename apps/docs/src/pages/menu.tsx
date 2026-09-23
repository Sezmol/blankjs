import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { MenuBasic } from "../demos/menu/basic";
import basicCode from "../demos/menu/basic.tsx?raw";
import { MenuControlled } from "../demos/menu/controlled";
import controlledCode from "../demos/menu/controlled.tsx?raw";

export const MenuPage = () => (
  <article className="docs-page">
    <h1>Menu</h1>

    <p className="docs-lead">
      A dropdown list of commands with <code>role="menu"</code>, arrow-key
      navigation, and "pick an action, then close" semantics. It runs on the
      same native Popover API as{" "}
      <Link to="/components/popover">Popover</Link>.
    </p>

    <Demo code={basicCode}>
      <MenuBasic />
    </Demo>

    <h2>Menu or Popover</h2>

    <p>
      Popover is a container and leaves your content alone. Menu expects a
      list of commands: focus moves into the menu on open and back to the
      trigger on close, arrow keys walk the items, and a click or{" "}
      <code>Enter</code> runs the item and closes the menu. Put interactive
      content where the user <em>stays</em>, such as forms and filters, in a
      Popover. Use Menu for a list of actions where the user{" "}
      <em>chooses and leaves</em>. Menu items must not contain inputs.
    </p>

    <h2>Keyboard and focus</h2>

    <ul className="docs-list">
      <li>
        <code>ArrowDown</code> on the trigger opens the menu with the first
        item highlighted, <code>ArrowUp</code> with the last.
      </li>
      <li>
        Focus sits on the menu container, and{" "}
        <code>aria-activedescendant</code> points at the highlighted item.{" "}
        <Link to="/components/select">Select</Link> uses the same pattern.
      </li>
      <li>
        <code>Enter</code>/<code>Space</code> call <code>node.click()</code>{" "}
        on the highlighted item, so your <code>onClick</code> fires the same
        way for mouse and keys.
      </li>
      <li>
        <code>Escape</code> and light dismiss come from the Popover API.
        Closing returns focus to the trigger only when focus was inside the
        menu, so a click elsewhere keeps focus where the user put it.
      </li>
      <li>
        Navigation skips disabled items, and they ignore clicks.{" "}
        <code>preventDefault()</code> in an item's <code>onClick</code>{" "}
        keeps the menu open.
      </li>
    </ul>

    <h2>Controlled</h2>

    <Demo code={controlledCode}>
      <MenuControlled />
    </Demo>

    <h2>API</h2>

    <h3>Menu.Root</h3>

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
          description: "Whether the menu starts open in uncontrolled mode.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description:
            "Called on every open and close, including browser-initiated ones.",
        },
      ]}
    />

    <h3>Menu.Trigger</h3>

    <PropsTable
      props={[
        {
          name: "asChild",
          type: "boolean",
          defaultValue: "false",
          description:
            "Renders the child element instead of the built-in button, merging menu behavior onto it.",
        },
      ]}
    />

    <h3>Menu.Content</h3>

    <PropsTable
      props={[
        {
          name: "placement",
          type: "Placement",
          defaultValue: '"bottom-start"',
          description:
            "Side and alignment relative to the trigger; flips at viewport edges.",
        },
      ]}
    />

    <h3>Menu.Item</h3>

    <PropsTable
      props={[
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description:
            "Skipped by keyboard navigation; clicks are ignored, including the user onClick.",
        },
      ]}
    />

    <p>
      Typeahead, submenus, and checkbox items are future work; none of them
      changes this API.
    </p>
  </article>
);
