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
      A styled native <code>&lt;button&gt;</code> with three variants, two
      colors, and three sizes. It changes one browser default: the{" "}
      <code>type</code>.
    </p>

    <Demo code={variantsCode}>
      <ButtonVariants />
    </Demo>

    <h2>Variants and colors</h2>

    <p>
      <code>variant</code> sets the weight: <code>solid</code> for the
      primary action, <code>outline</code> for secondary, <code>ghost</code>{" "}
      for toolbars and tight spots. <code>color="danger"</code> works with
      every variant. It points the accent CSS variable at the danger color,
      so variants and colors combine without special cases. Restyle one
      variant and both colors follow.
    </p>

    <h2>type defaults to "button"</h2>

    <p>
      A native button inside a form defaults to <code>type="submit"</code>,
      so a "Cancel" button submits the form. Button sets the default to{" "}
      <code>"button"</code>. Pass <code>type="submit"</code> where the button
      should submit, as the <Link to="/components/form">Form</Link> examples
      do.
    </p>

    <h2>Sizes and state</h2>

    <Demo code={sizesCode}>
      <ButtonSizes />
    </Demo>

    <h2>Rendering something else</h2>

    <p>
      <code>asChild</code> merges the button's styling and props onto your
      own element. The usual case is a link styled as a button. You keep a
      real <code>&lt;a&gt;</code> with link semantics:
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
      Button passes through every native <code>button</code> prop, including{" "}
      <code>type</code>. Its default is <code>"button"</code>; the native
      default is <code>"submit"</code>.
    </p>
  </article>
);
