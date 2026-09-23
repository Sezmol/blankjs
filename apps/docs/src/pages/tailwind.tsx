import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";

const setupCode = `@layer theme, base, blankjs, components, utilities;

@import "tailwindcss";
@import "@blankjs/react/styles.css" layer(blankjs);
`;

const resetCode = `@layer reset, theme, base, blankjs, components, utilities;

@layer reset {
  * {
    margin: 0;
    padding: 0;
  }
}
`;

const themeInlineCode = `@theme inline {
  --color-bk-accent: var(--bk-color-accent);
  --color-bk-danger: var(--bk-color-danger);
  --radius-bk-md: var(--bk-radius-md);
}
`;

const brandCode = `@theme {
  --color-brand: oklch(0.65 0.2 150);
}

:root {
  --bk-color-accent: var(--color-brand);
  --bk-color-accent-hover: var(--color-brand);
}
`;

export const TailwindPage = () => (
  <article className="docs-page">
    <h1>Tailwind CSS</h1>

    <p className="docs-lead">
      You install no adapter and no preset: the tokens are already CSS
      variables. You do need to set up the cascade, and one line of that
      setup is easy to get wrong.
    </p>

    <h2>Utilities lose by default</h2>

    <p>
      The stylesheet ships <strong>unlayered</strong>. Tailwind v4 puts its
      utilities in <code>@layer utilities</code>. An unlayered rule beats any
      layered rule regardless of specificity, so{" "}
      <code>&lt;Button className="bg-red-500"&gt;</code> loses every time,
      and extra specificity does not help. The usual workaround is{" "}
      <code>!important</code> everywhere. Put the blankjs stylesheet in a
      layer instead.
    </p>

    <h2>Setup</h2>

    <p>
      Add three lines to your CSS entry point and remove the JavaScript{" "}
      <code>import "@blankjs/react/styles.css"</code>. Only CSS can put a
      stylesheet in a layer:
    </p>

    <CodeBlock code={setupCode} lang="css" />

    <p>
      The browser orders layers by where it{" "}
      <strong>first sees them declared</strong>, and import order does not
      count. The first line sets that order. Without it the browser declares{" "}
      <code>blankjs</code> last, which puts our styles back on top of your
      utilities. Rearranging the imports does not fix it.
    </p>

    <p>
      <code>blankjs</code> has to sit <strong>after</strong>{" "}
      <code>base</code>, because Preflight resets borders and backgrounds on
      every element and would erase the components. It has to sit{" "}
      <strong>before</strong> <code>utilities</code>, so your utility classes
      win.
    </p>

    <h2>Watch your global reset</h2>

    <p>
      A classic reset outside any layer now beats our layered rules and
      strips the padding from every component:
    </p>

    <CodeBlock code={`* { margin: 0; padding: 0; }`} lang="css" />

    <p>
      Preflight already does that reset, so delete yours. To keep it, give it
      its own layer declared before <code>blankjs</code>:
    </p>

    <CodeBlock code={resetCode} lang="css" />

    <h2>Our tokens as utilities</h2>

    <p>
      To write <code>bg-bk-accent</code> in your own markup, map the tokens
      into Tailwind's theme with <strong><code>@theme inline</code></strong>:
    </p>

    <CodeBlock code={themeInlineCode} lang="css" />

    <p>
      Plain <code>@theme</code> resolves the value once at <code>:root</code>.
      A nested subtree with its own <code>data-bk-theme</code> then keeps the
      root theme's color in your utilities, while the components inside it
      switch. <code>inline</code> puts the variable into the utility itself,
      so it resolves per element. Opacity modifiers like{" "}
      <code>bg-bk-accent/50</code> work with both.
    </p>

    <h2>Or drive our tokens from yours</h2>

    <p>
      If you already have a brand palette, define it once in Tailwind's theme
      and point our tokens at it. One value then feeds <code>bg-brand</code>{" "}
      in your markup and the accent, focus ring and checked state of every
      component.
    </p>

    <CodeBlock code={brandCode} lang="css" />

    <p>
      This direction needs no <code>inline</code>: the theme value is a
      literal, and our token holds the reference.
    </p>

    <h2>Or skip our CSS</h2>

    <p>
      To style everything with utilities, skip the stylesheet import. The
      components keep working, because none of their behavior lives in CSS.
      They set structural styles inline, such as hiding the proxy input that
      carries a Select or MultiSelect into <code>FormData</code>, so an
      unstyled kit looks plain and still works. You declare no layers in this
      mode, since none of our CSS is left to override.
    </p>

    <p>
      You get the native look: <code>Checkbox</code>, <code>Radio</code> and{" "}
      <code>Slider</code> fall back to the browser's own controls, and
      popovers get the user-agent <code>[popover]</code> box. The class names
      stay on the elements, so you can target{" "}
      <code>.bk-select-trigger</code> and the rest, or pass{" "}
      <code>className</code> and ignore them.
    </p>

    <p>
      <code>@blankjs/core</code> gives you the hooks without the markup, for
      when you want to build the DOM structure yourself. To keep our look and
      change only the colors, stay on the stylesheet and override tokens, as{" "}
      <Link to="/getting-started">Getting Started</Link> describes.
    </p>

    <h2>Tailwind v3</h2>

    <p>
      v3 compiles <code>@tailwind utilities</code> to unlayered CSS, so none
      of this applies. Utilities and our styles compete on specificity and
      source order. Class-level utilities like <code>bg-red-500</code> tie
      with our single-class rules, and the last stylesheet wins, so import
      ours first.
    </p>
  </article>
);
