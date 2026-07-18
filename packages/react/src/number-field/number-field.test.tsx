import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { NumberField } from "./index";
import { Field } from "../field";

const nextFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

const getInput = () => screen.getByRole("spinbutton") as HTMLInputElement;
const getIncrement = () => screen.getByRole("button", { name: "Increase" });
const getDecrement = () => screen.getByRole("button", { name: "Decrease" });

test("renders a native number input with spin buttons", () => {
  render(<NumberField />);

  const input = getInput();

  expect(input.type).toBe("number");
  expect(input).toHaveClass("bk-input");
  expect(getIncrement()).toHaveAttribute("tabindex", "-1");
  expect(getDecrement()).toHaveAttribute("tabindex", "-1");
});

test("stamps the size prop on the wrapper", () => {
  const { container } = render(<NumberField size="lg" />);

  expect(container.querySelector(".bk-number-field")).toHaveAttribute(
    "data-size",
    "lg",
  );
});

test("increment steps the value up", () => {
  render(<NumberField defaultValue={5} step={5} />);

  fireEvent.click(getIncrement());

  expect(getInput().value).toBe("10");
});

test("decrement steps the value down", () => {
  render(<NumberField defaultValue={5} />);

  fireEvent.click(getDecrement());

  expect(getInput().value).toBe("4");
});

test("stepping fires the consumer onChange", () => {
  const values: string[] = [];

  const Controlled = () => {
    const [value, setValue] = useState("5");

    return (
      <NumberField
        value={value}
        onChange={(e) => {
          values.push(e.target.value);
          setValue(e.target.value);
        }}
      />
    );
  };

  render(<Controlled />);

  fireEvent.click(getIncrement());

  expect(values).toEqual(["6"]);
  expect(getInput().value).toBe("6");
});

test("increment disables at max, decrement at min", () => {
  render(<NumberField defaultValue={9} min={0} max={10} />);

  expect(getIncrement()).toBeEnabled();

  fireEvent.click(getIncrement());

  expect(getInput().value).toBe("10");
  expect(getIncrement()).toBeDisabled();
  expect(getDecrement()).toBeEnabled();
});

test("bounds apply on mount from defaultValue", () => {
  render(<NumberField defaultValue={10} max={10} />);

  expect(getIncrement()).toBeDisabled();
});

test("typing past a bound disables the button", () => {
  render(<NumberField min={0} max={10} />);

  fireEvent.input(getInput(), { target: { value: "10" } });

  expect(getIncrement()).toBeDisabled();

  fireEvent.input(getInput(), { target: { value: "3" } });

  expect(getIncrement()).toBeEnabled();
  expect(getDecrement()).toBeEnabled();
});

test("an empty value keeps both buttons enabled", () => {
  render(<NumberField min={0} max={10} />);

  expect(getIncrement()).toBeEnabled();
  expect(getDecrement()).toBeEnabled();
});

test("bounds recompute after a form reset", async () => {
  render(
    <form data-testid="form">
      <NumberField defaultValue={10} max={10} />
    </form>,
  );

  fireEvent.input(getInput(), { target: { value: "3" } });

  expect(getIncrement()).toBeEnabled();

  (screen.getByTestId("form") as HTMLFormElement).reset();

  await nextFrame();

  expect(getInput().value).toBe("10");
  expect(getIncrement()).toBeDisabled();
});

test("submits through FormData by name", () => {
  render(
    <form data-testid="form">
      <NumberField name="qty" defaultValue={3} />
    </form>,
  );

  const data = new FormData(screen.getByTestId("form") as HTMLFormElement);

  expect(data.get("qty")).toBe("3");
});

test("disabled disables the input and both buttons", () => {
  render(<NumberField disabled />);

  expect(getInput()).toBeDisabled();
  expect(getIncrement()).toBeDisabled();
  expect(getDecrement()).toBeDisabled();
});

test("inherits disabled and label wiring from Field", () => {
  render(
    <Field.Root disabled>
      <Field.Label>Quantity</Field.Label>
      <NumberField />
    </Field.Root>,
  );

  expect(screen.getByLabelText("Quantity")).toBeDisabled();
  expect(getIncrement()).toBeDisabled();
});

test("forwards the consumer ref to the input", () => {
  let node: HTMLInputElement | null = null;

  render(
    <NumberField
      ref={(n) => {
        node = n;
      }}
    />,
  );

  expect(node).toBe(getInput());
});

test("types: forbids type and children", () => {
  // @ts-expect-error type is fixed to number
  void (<NumberField type="text" />);
  // @ts-expect-error a void element cannot take children
  void (<NumberField>child</NumberField>);
});
