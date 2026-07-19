import { Link } from "react-router";
import { CodeBlock } from "../components/code-block";
import { Demo } from "../components/demo";
import { PropsTable } from "../components/props-table";
import { SliderBasic } from "../demos/slider/basic";
import basicCode from "../demos/slider/basic.tsx?raw";
import { SliderForm } from "../demos/slider/form";
import formCode from "../demos/slider/form.tsx?raw";
import { SliderStep } from "../demos/slider/step";
import stepCode from "../demos/slider/step.tsx?raw";

const fillCode = `
background: linear-gradient(
  to right,
  var(--bk-color-accent) 0 var(--bk-slider-fill),
  var(--bk-color-surface-muted) var(--bk-slider-fill)
);
`;

export const SliderPage = () => (
  <article className="docs-page">
    <h1>Slider</h1>

    <p className="docs-lead">
      A styled native <code>&lt;input type="range"&gt;</code>. Dragging,
      keyboard stepping, touch, RTL, and form participation are the
      browser's; the library contributes a coat of paint and one CSS
      variable.
    </p>

    <Demo code={basicCode}>
      <SliderBasic />
    </Demo>

    <h2>How the fill works</h2>

    <p>
      The colored track up to the thumb is not an extra element — it is the
      track's own background, a two-stop gradient split at{" "}
      <code>--bk-slider-fill</code>:
    </p>

    <CodeBlock code={fillCode} lang="css" />

    <p>
      The component keeps that variable equal to the value's position:{" "}
      <code>((value − min) / (max − min)) × 100%</code>. It updates on input,
      on mount, and after a form reset — the reset case matters, because the
      browser restores the value silently without firing an event. Restyle
      the fill by overriding the variable's colors; the geometry stays
      correct.
    </p>

    <h2>Step, range, and state</h2>

    <p>
      <code>min</code>, <code>max</code>, and <code>step</code> are the
      native attributes; arrows and Page Up/Down step accordingly. Disabling
      through a <Link to="/components/field">Field</Link> works like every
      other control:
    </p>

    <Demo code={stepCode}>
      <SliderStep />
    </Demo>

    <h2>In a form</h2>

    <p>
      A real input needs no mirroring: the value is in <code>FormData</code>{" "}
      under its <code>name</code>, and reset restores{" "}
      <code>defaultValue</code> — fill included.
    </p>

    <Demo code={formCode}>
      <SliderForm />
    </Demo>

    <h2>API</h2>

    <p>
      Every native <code>input</code> prop except <code>type</code> passes
      through — <code>min</code>, <code>max</code>, <code>step</code>,{" "}
      <code>list</code>, and friends.
    </p>

    <PropsTable
      props={[
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          defaultValue: '"md"',
          description: "Track and thumb size.",
        },
      ]}
    />

    <p>
      A two-thumb range slider and step tick marks are on the roadmap;
      neither changes this component's API.
    </p>
  </article>
);
