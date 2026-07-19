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
      A dropdown list of commands: <code>role="menu"</code>, arrow-key
      navigation, and "pick an action, then close" semantics — layered on
      the same native Popover API as{" "}
      <Link to="/components/popover">Popover</Link>.
    </p>

    <Demo code={basicCode}>
      <MenuBasic />
    </Demo>

    <h2>Menu or Popover?</h2>

    <p>
      Popover is a container and stays out of your content's way. Menu
      knows its content is a list of commands, and that knowledge is the
      whole component: focus moves into the menu on open and back to the
      trigger on close, arrow keys walk the items, a click or{" "}
      <code>Enter</code> runs the item and closes everything. Interactive
      content where the user <em>stays</em> — forms, filters — belongs in a
      Popover; a list of actions where the user <em>chooses and leaves</em>{" "}
      belongs here. Menu items must not contain inputs.
    </p>

    <h2>Keyboard and focus</h2>

    <ul className="docs-list">
      <li>
        <code>ArrowDown</code> on the trigger opens with the first item
        highlighted, <code>ArrowUp</code> — with the last.
      </li>
      <li>
        Physical focus sits on the menu container; the highlight is virtual,
        reported through <code>aria-activedescendant</code> — the same
        pattern as <Link to="/components/select">Select</Link>, so the whole
        kit speaks one dialect.
      </li>
      <li>
        <code>Enter</code>/<code>Space</code> click the highlighted item —
        literally: keyboard activation is routed through{" "}
        <code>node.click()</code>, so your <code>onClick</code> fires the
        same way for mouse and keys.
      </li>
      <li>
        <code>Escape</code> and light dismiss come from the Popover API;
        closing returns focus to the trigger only when focus was inside the
        menu — a click elsewhere keeps its focus.
      </li>
      <li>
        Disabled items are skipped by navigation and ignore clicks;{" "}
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
