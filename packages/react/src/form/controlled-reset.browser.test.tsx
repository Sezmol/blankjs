import { render, screen } from "@testing-library/react";
import { Field } from "../field";
import { RadioGroup } from "../radio";
import { Checkbox } from "../checkbox";
import "../styles.css";

const Pinned = ({ fruit, agree }: { fruit: string; agree: boolean }) => (
  <form aria-label="f">
    <Field.Root
      validate={(value) => (value === "banana" ? null : "Pick banana")}
    >
      <RadioGroup.Root
        name="fruit"
        aria-label="Fruit"
        value={fruit}
        onValueChange={() => {}}
      >
        <RadioGroup.Item value="apple" aria-label="apple" />
        <RadioGroup.Item value="banana" aria-label="banana" />
      </RadioGroup.Root>
    </Field.Root>
    <Checkbox
      name="agree"
      aria-label="agree"
      checked={agree}
      onCheckedChange={() => {}}
    />
  </form>
);

const form = () => screen.getByRole("form") as HTMLFormElement;

const radio = (name: string) =>
  screen.getByRole("radio", { name }) as HTMLInputElement;

const settled = () => new Promise((resolve) => setTimeout(resolve, 50));

test("a real reset keeps pinned values, FormData and validity in line", async () => {
  const { rerender } = render(<Pinned fruit="apple" agree={false} />);

  rerender(<Pinned fruit="banana" agree />);

  form().reset();
  form().reset();
  await settled();

  expect(radio("banana").checked).toBe(true);
  expect(radio("apple").checked).toBe(false);
  expect(screen.getByRole("checkbox")).toBeChecked();
  expect(new FormData(form()).get("fruit")).toBe("banana");
  expect(form().checkValidity()).toBe(true);
});

test("a prop change before the reset handler runs wins", async () => {
  const { rerender } = render(<Pinned fruit="banana" agree />);

  form().reset();
  rerender(<Pinned fruit="apple" agree={false} />);
  await settled();

  expect(radio("apple").checked).toBe(true);
  expect(radio("banana").checked).toBe(false);
  expect(screen.getByRole("checkbox")).not.toBeChecked();
  expect(form().checkValidity()).toBe(false);
});
