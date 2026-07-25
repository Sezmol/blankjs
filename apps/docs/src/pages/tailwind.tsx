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
      There is no adapter and no preset to install — the tokens are already
      CSS variables. What does need setting up is the cascade, and exactly one
      line of it is easy to get wrong.
    </p>

    <h2>Why utilities lose by default</h2>

    <p>
      The stylesheet ships <strong>unlayered</strong>. Tailwind v4 puts its
      utilities in <code>@layer utilities</code>. An unlayered rule beats any
      layered rule regardless of specificity, so{" "}
      <code>&lt;Button className="bg-red-500"&gt;</code> does not lose{" "}
      <em>sometimes</em> — it loses <em>always</em>, and no amount of extra
      specificity helps. The usual workaround is{" "}
      <code>!important</code> everywhere. Don't; layer us instead.
    </p>

    <h2>Setup</h2>

    <p>
      Three lines in your CSS entry point, then drop the JavaScript{" "}
      <code>import "@blankjs/react/styles.css"</code> — a layer can only be
      attached from CSS:
    </p>

    <CodeBlock code={setupCode} lang="css" />

    <p>
      Layer priority comes from the order in which layers are{" "}
      <strong>first declared</strong>, not from import order, so that first
      line is doing real work. Without it the browser ends up declaring{" "}
      <code>blankjs</code> last, which puts us back on top of your utilities.
      Rearranging the imports does not fix it.
    </p>

    <p>
      The position matters in both directions. <code>blankjs</code> sits{" "}
      <strong>after</strong> <code>base</code>, because Preflight resets
      borders and backgrounds on every element and would erase the components;
      and <strong>before</strong> <code>utilities</code>, so your utility
      classes win.
    </p>

    <h2>Watch your global reset</h2>

    <p>
      This is the one thing that bites. If your CSS has the classic reset
      sitting outside any layer, it now beats our layered rules and strips the
      padding from every component:
    </p>

    <CodeBlock code={`* { margin: 0; padding: 0; }`} lang="css" />

    <p>
      Preflight already does that reset, so the simplest fix is to delete
      yours. If you want to keep it, give it its own layer declared before{" "}
      <code>blankjs</code>:
    </p>

    <CodeBlock code={resetCode} lang="css" />

    <h2>Our tokens as utilities</h2>

    <p>
      To write <code>bg-bk-accent</code> in your own markup, map the tokens
      into Tailwind's theme. Use <code>@theme inline</code> —{" "}
      <strong>not plain <code>@theme</code></strong>:
    </p>

    <CodeBlock code={themeInlineCode} lang="css" />

    <p>
      Plain <code>@theme</code> resolves the value once at <code>:root</code>,
      so a nested subtree with its own{" "}
      <code>data-bk-theme</code> keeps rendering the root theme's colour while
      every component inside it switches correctly. <code>inline</code>{" "}
      substitutes the variable into the utility itself, which resolves per
      element. Opacity modifiers like <code>bg-bk-accent/50</code> work either
      way.
    </p>

    <h2>Or drive our tokens from yours</h2>

    <p>
      The more useful direction if you already have a brand palette: define it
      once in Tailwind's theme and point our tokens at it. One value then
      feeds both <code>bg-brand</code> in your markup and every component's
      accent, focus ring and checked state.
    </p>

    <CodeBlock code={brandCode} lang="css" />

    <p>
      No <code>inline</code> needed here — the theme value is a literal, and
      it is our token that does the referencing.
    </p>

    <h2>Or skip our CSS entirely</h2>

    <p>
      If you'd rather style everything with utilities, don't import the
      stylesheet at all. The components keep working — nothing about their
      behaviour lives in CSS. Anything structural, like hiding the proxy input
      that carries a Select or MultiSelect into <code>FormData</code>, is set
      inline by the component itself, so an unstyled kit is plain, not broken.
      There are no layers to declare in this mode, because there is nothing of
      ours left to override.
    </p>

    <p>
      What you get is the native look: <code>Checkbox</code>,{" "}
      <code>Radio</code> and <code>Slider</code> fall back to the browser's own
      controls, and popovers get the user-agent <code>[popover]</code> box.
      Every class name is still on the element, so{" "}
      <code>.bk-select-trigger</code> and friends are yours to target — or
      pass <code>className</code> and ignore them.
    </p>

    <p>
      Going further, <code>@blankjs/core</code> gives you the hooks without the
      markup, for when even our DOM structure is more than you want. And if you
      like our look and only need it recoloured, stay on the stylesheet and
      override tokens — see{" "}
      <Link to="/getting-started">Getting Started</Link>.
    </p>

    <h2>Tailwind v3</h2>

    <p>
      v3 compiles <code>@tailwind utilities</code> to unlayered CSS, so none
      of this applies: utilities and our styles fight on specificity and
      source order instead. Class-level utilities like <code>bg-red-500</code>{" "}
      tie with our single-class rules, and the last stylesheet wins — import
      ours first.
    </p>
  </article>
);
