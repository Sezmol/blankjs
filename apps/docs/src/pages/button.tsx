import { Link } from "react-router";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { ButtonAsChild } from "../demos/button/as-child";
import asChildCode from "../demos/button/as-child.tsx?raw";
import { ButtonSizes } from "../demos/button/sizes";
import sizesCode from "../demos/button/sizes.tsx?raw";
import { ButtonVariants } from "../demos/button/variants";
import variantsCode from "../demos/button/variants.tsx?raw";

export const ButtonPage = () => (
  <article className="docs-page">
    <h1>Button</h1>

    <p className="docs-lead">
      A styled native <code>&lt;button&gt;</code>. Three variants, two
      colors, three sizes — and one deliberate change to a browser default.
    </p>

    <Demo code={variantsCode}>
      <ButtonVariants />
    </Demo>

    <h2>Variants and colors</h2>

    <p>
      <code>variant</code> sets the weight — <code>solid</code> for the
      primary action, <code>outline</code> for secondary, <code>ghost</code>{" "}
      for toolbars and tight spots. <code>color="danger"</code> works with
      every variant: under the hood it just re-points the accent CSS
      variable, so the two axes never multiply into special cases. Restyle
      one variant and both colors follow.
    </p>

    <h2>type defaults to "button"</h2>

    <p>
      A native button inside a form defaults to <code>type="submit"</code> —
      the classic footgun where a "Cancel" button submits the form. This
      component flips the default to <code>"button"</code>; pass{" "}
      <code>type="submit"</code> explicitly where submitting is the point,
      as the <Link to="/components/form">Form</Link> examples do.
    </p>

    <h2>Sizes and state</h2>

    <Demo code={sizesCode}>
      <ButtonSizes />
    </Demo>

    <h2>Rendering something else</h2>

    <p>
      <code>asChild</code> merges the button's styling and props onto your
      own element — the usual case is a link that should look like a
      button. No <code>href</code>-on-button hacks, a real{" "}
      <code>&lt;a&gt;</code> with real link semantics:
    </p>

    <Demo code={asChildCode}>
      <ButtonAsChild />
    </Demo>

    <h2>API</h2>

    <PropsTable
      props={[
        {
          name: "variant",
          type: '"solid" | "outline" | "ghost"',
          defaultValue: '"solid"',
          description: "Visual weight of the button.",
        },
        {
          name: "color",
          type: '"accent" | "danger"',
          defaultValue: '"accent"',
          description: "Accent for normal actions, danger for destructive ones.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Padding and font size.",
        },
        {
          name: "asChild",
          type: "boolean",
          defaultValue: "false",
          description:
            "Renders the child element instead of a button, merging props onto it.",
        },
      ]}
    />

    <p>
      Every native <code>button</code> prop passes through, including{" "}
      <code>type</code> — the default is <code>"button"</code>, not the
      native <code>"submit"</code>.
    </p>
  </article>
);
