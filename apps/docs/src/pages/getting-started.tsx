import { CodeBlock } from "../components/code-block";

const usageCode = `
import { Field, Select } from "@blankjs/react";
import "@blankjs/react/styles.css";

export const CountryField = () => (
  <Field.Root name="country" required>
    <Field.Label>Country</Field.Label>

    <Select.Root name="country">
      <Select.Trigger>
        <Select.Value placeholder="Select a country" />
      </Select.Trigger>

      <Select.Content>
        <Select.Item value="AU">Australia</Select.Item>
        <Select.Item value="AT">Austria</Select.Item>
      </Select.Content>
    </Select.Root>

    <Field.Error match="valueMissing">Pick a country first</Field.Error>
  </Field.Root>
);
`;

const themeCode = `
<html data-bk-theme="dark">
`;

const overrideCode = `
:root {
  --bk-color-accent: oklch(0.65 0.2 250);
}
`;

export const GettingStartedPage = () => (
  <article className="docs-page">
    <h1>Getting Started</h1>

    <p className="docs-lead">
      Install the package, import the stylesheet once, compose components.
    </p>

    <h2>Installation</h2>

    <CodeBlock code="npm install @blankjs/react" lang="bash" />

    <p>
      blankjs requires <strong>React 19</strong> — the components lean on
      19-only APIs: <code>ref</code> as a regular prop and{" "}
      <code>&lt;Context&gt;</code> as a provider.
    </p>

    <h2>Usage</h2>

    <CodeBlock code={usageCode} />

    <p>
      The stylesheet ships design tokens as CSS variables plus styles for every
      component. Import it once at the root of your app.
    </p>

    <h2>Theming</h2>

    <p>
      Themes switch with one attribute on any ancestor — no JavaScript
      involved:
    </p>

    <CodeBlock code={themeCode} />

    <p>Override any token to rebrand:</p>

    <CodeBlock code={overrideCode} lang="css" />
  </article>
);
