import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Field } from "../field";
import { PinInput } from "./index";
import "../styles.css";

test("takes typed digits inside a Field", async () => {
  render(
    <Field.Root name="code">
      <Field.Label>Code</Field.Label>
      <PinInput name="code" length={4} />
    </Field.Root>,
  );

  const first = screen.getByLabelText("1 of 4");

  await userEvent.click(first);
  await userEvent.keyboard("1234");

  const cells = [1, 2, 3, 4].map(
    (n) => screen.getByLabelText(`${n} of 4`) as HTMLInputElement,
  );

  expect(cells.map((cell) => cell.value)).toEqual(["1", "2", "3", "4"]);

  const proxy = document.querySelector<HTMLInputElement>('input[name="code"]');

  expect(proxy?.value).toBe("1234");
});

test("backspace walks back through the cells", async () => {
  render(<PinInput name="code" length={4} />);

  await userEvent.click(screen.getByLabelText("1 of 4"));
  await userEvent.keyboard("12");
  await userEvent.keyboard("{Backspace}{Backspace}");

  const proxy = document.querySelector<HTMLInputElement>('input[name="code"]');

  expect(proxy?.value).toBe("");
  expect(document.activeElement).toBe(screen.getByLabelText("1 of 4"));
});

test.each([false, true])(
  "a failed submit focuses the first empty cell, inside a Field: %s",
  async (inField) => {
    const pin = <PinInput name="code" length={4} required />;

    render(
      <form onSubmit={(e) => e.preventDefault()}>
        {inField ? (
          <Field.Root>
            <Field.Label>Code</Field.Label>
            {pin}
          </Field.Root>
        ) : (
          pin
        )}
        <button>Send</button>
      </form>,
    );

    await userEvent.click(screen.getByLabelText("1 of 4"));
    await userEvent.keyboard("12");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByLabelText("3 of 4")).toHaveFocus();
  },
);

test("checkValidity from code leaves focus alone", async () => {
  render(
    <form data-testid="form">
      <PinInput name="code" length={4} required />
      <input aria-label="Other" />
    </form>,
  );

  await userEvent.click(screen.getByLabelText("Other"));

  (screen.getByTestId("form") as HTMLFormElement).checkValidity();

  expect(screen.getByLabelText("Other")).toHaveFocus();
});
