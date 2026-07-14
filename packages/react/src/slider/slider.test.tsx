import { fireEvent, render, screen } from "@testing-library/react";
import { Slider } from "./index";
import { Field } from "../field";

const nextFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

const getFill = (input: HTMLElement) =>
  (input as HTMLInputElement).style.getPropertyValue("--bk-slider-fill");

test("renders a native range input", () => {
  render(<Slider data-testid="slider" />);

  const slider = screen.getByTestId("slider") as HTMLInputElement;

  expect(slider.tagName).toBe("INPUT");
  expect(slider.type).toBe("range");
  expect(slider).toHaveClass("bk-slider");
  expect(slider).toHaveAttribute("data-size", "md");
});

test("stamps the size prop", () => {
  render(<Slider data-testid="slider" size="lg" />);

  expect(screen.getByTestId("slider")).toHaveAttribute("data-size", "lg");
});

test("sets the fill variable on mount from defaultValue", () => {
  render(<Slider data-testid="slider" defaultValue={30} />);

  expect(getFill(screen.getByTestId("slider"))).toBe("30%");
});

test("computes the fill against min and max", () => {
  render(<Slider data-testid="slider" min={0} max={200} defaultValue={50} />);

  expect(getFill(screen.getByTestId("slider"))).toBe("25%");
});

test("updates the fill while the user drags", () => {
  render(<Slider data-testid="slider" defaultValue={10} />);

  const slider = screen.getByTestId("slider");

  fireEvent.input(slider, { target: { value: "80" } });

  expect(getFill(slider)).toBe("80%");
});

test("keeps the fill in sync in controlled mode", () => {
  const { rerender } = render(
    <Slider data-testid="slider" value={20} onChange={() => {}} />,
  );

  rerender(<Slider data-testid="slider" value={90} onChange={() => {}} />);

  expect(getFill(screen.getByTestId("slider"))).toBe("90%");
});

test("recomputes the fill after a form reset", async () => {
  render(
    <form data-testid="form">
      <Slider data-testid="slider" defaultValue={75} />
    </form>,
  );

  const slider = screen.getByTestId("slider") as HTMLInputElement;

  fireEvent.input(slider, { target: { value: "10" } });

  expect(getFill(slider)).toBe("10%");

  (screen.getByTestId("form") as HTMLFormElement).reset();

  await nextFrame();

  expect(slider.value).toBe("75");
  expect(getFill(slider)).toBe("75%");
});

test("submits through FormData by name", () => {
  render(
    <form data-testid="form">
      <Slider name="volume" defaultValue={42} />
    </form>,
  );

  const data = new FormData(screen.getByTestId("form") as HTMLFormElement);

  expect(data.get("volume")).toBe("42");
});

test("own disabled prop works outside a Field", () => {
  render(<Slider data-testid="slider" disabled />);

  expect(screen.getByTestId("slider")).toBeDisabled();
});

test("inherits disabled and label wiring from Field", () => {
  render(
    <Field.Root disabled>
      <Field.Label>Volume</Field.Label>
      <Slider />
    </Field.Root>,
  );

  const slider = screen.getByLabelText("Volume");

  expect(slider).toBeDisabled();
});

test("types: forbids type and children", () => {
  // @ts-expect-error type is fixed to range
  void (<Slider type="text" />);
  // @ts-expect-error a void element cannot take children
  void (<Slider>child</Slider>);
});
