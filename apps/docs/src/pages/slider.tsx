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
  var(--bk-color-border-control) var(--bk-slider-fill)
);
`;

export const SliderPage = () => (
  <article className="docs-page">
    <h1>Slider</h1>

    <p className="docs-lead">
      A styled native <code>&lt;input type="range"&gt;</code>. The browser
      handles dragging, keyboard stepping, touch, RTL, and form
      participation. The library adds styles and one CSS variable.
    </p>

    <Demo code={basicCode}>
      <SliderBasic />
    </Demo>

    <h2>The fill</h2>

    <p>
      The colored part of the track is the track's own background: a
      two-stop gradient split at <code>--bk-slider-fill</code>:
    </p>

    <CodeBlock code={fillCode} lang="css" />

    <p>
      Slider keeps that variable equal to the value's position:{" "}
      <code>((value − min) / (max − min)) × 100%</code>. It updates the
      variable on input, on mount, and after a form reset. Reset needs its
      own handling because the browser restores the value without firing an
      event. To restyle the fill, override the colors in the gradient; the
      geometry stays correct.
    </p>

    <h2>Step, range, and state</h2>

    <p>
      <code>min</code>, <code>max</code>, and <code>step</code> are the
      native attributes, and the arrow keys and Page Up/Down step by them.
      Disabling through a <Link to="/components/field">Field</Link> works as
      with any other control:
    </p>

    <Demo code={stepCode}>
      <SliderStep />
    </Demo>

    <h2>In a form</h2>

    <p>
      The real input needs no mirroring: the value lands in{" "}
      <code>FormData</code> under its <code>name</code>, and reset restores{" "}
      <code>defaultValue</code> along with the fill.
    </p>

    <Demo code={formCode}>
      <SliderForm />
    </Demo>

    <h2>API</h2>

    <p>
      Slider passes through every native <code>input</code> prop except{" "}
      <code>type</code>: <code>min</code>, <code>max</code>, <code>step</code>,{" "}
      <code>list</code>, and the rest.
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
