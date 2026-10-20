import type { MouseEvent } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field } from "../field";
import { TextInput } from "../text-input";

const TwoRequired = ({
  onClick,
  onSubmit,
}: {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: () => void;
}) => (
  <form
    data-testid="form"
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.();
    }}
  >
    <Field.Root required>
      <Field.Label>First</Field.Label>
      <TextInput name="first" />
    </Field.Root>

    <Field.Root required>
      <Field.Label>Second</Field.Label>
      <TextInput name="second" />
    </Field.Root>

    <button type="submit" onClick={onClick}>
      Send
    </button>
  </form>
);

const form = () => screen.getByTestId("form") as HTMLFormElement;

const input = (label: string) =>
  screen.getByLabelText(label) as HTMLInputElement;

const send = () => screen.getByRole("button", { name: "Send" });

const nextTask = () => new Promise((resolve) => setTimeout(resolve, 10));

test("a failed submit still focuses the first invalid field", async () => {
  const user = userEvent.setup();

  render(<TwoRequired />);

  await user.click(send());

  await waitFor(() => expect(input("First")).toHaveFocus());
});

test("checkValidity in a canceled submit click leaves focus alone", async () => {
  const user = userEvent.setup();

  render(
    <TwoRequired
      onClick={(e) => {
        e.preventDefault();
        form().checkValidity();
      }}
    />,
  );

  await user.click(send());
  await nextTask();

  expect(send()).toHaveFocus();
});

test("focus goes where the browser blocked, not where checkValidity looked first", async () => {
  const user = userEvent.setup();

  render(
    <TwoRequired
      onClick={() => {
        form().checkValidity();
        input("First").value = "filled";
      }}
    />,
  );

  await user.click(send());

  await waitFor(() => expect(input("Second")).toHaveFocus());
});

test("checkValidity in onSubmit after a passing submit leaves focus alone", async () => {
  const user = userEvent.setup();

  render(
    <TwoRequired
      onSubmit={() => {
        input("First").value = "";
        form().checkValidity();
      }}
    />,
  );

  await user.type(input("First"), "a");
  await user.type(input("Second"), "b");
  await user.click(send());
  await nextTask();

  expect(send()).toHaveFocus();
});

test("stopPropagation in the click does not stop the focus", async () => {
  const user = userEvent.setup();

  render(<TwoRequired onClick={(e) => e.stopPropagation()} />);

  await user.click(send());

  await waitFor(() => expect(input("First")).toHaveFocus());
});

test("Enter whose submit click gets canceled leaves focus alone", async () => {
  const user = userEvent.setup();

  render(
    <TwoRequired
      onClick={(e) => {
        e.preventDefault();
        form().checkValidity();
      }}
    />,
  );

  await user.type(input("Second"), "b");
  await user.keyboard("{Enter}");
  await nextTask();

  expect(input("Second")).toHaveFocus();
});

test("a field disabled through its fieldset is skipped", async () => {
  const user = userEvent.setup();

  render(
    <form data-testid="form" onSubmit={(e) => e.preventDefault()}>
      <fieldset data-testid="group">
        <Field.Root validate={() => "Always broken"}>
          <Field.Label>First</Field.Label>
          <TextInput name="first" />
        </Field.Root>
      </fieldset>

      <Field.Root required>
        <Field.Label>Second</Field.Label>
        <TextInput name="second" />
      </Field.Root>

      <button
        type="submit"
        onClick={() => {
          form().checkValidity();
          (screen.getByTestId("group") as HTMLFieldSetElement).disabled = true;
        }}
      >
        Send
      </button>
    </form>,
  );

  await user.click(send());

  await waitFor(() => expect(input("Second")).toHaveFocus());
});

test("a nested submit click does not settle the outer one before it is canceled", async () => {
  const user = userEvent.setup();

  render(
    <form data-testid="form" onSubmit={(e) => e.preventDefault()}>
      <Field.Root required>
        <Field.Label>First</Field.Label>
        <TextInput name="first" />
      </Field.Root>

      <button
        type="submit"
        onClick={(e) => {
          form().checkValidity();
          screen.getByRole("button", { name: "Inner" }).click();
          e.preventDefault();
        }}
      >
        Send
      </button>
      <button type="submit" onClick={(e) => e.preventDefault()}>
        Inner
      </button>
    </form>,
  );

  await user.click(send());
  await nextTask();

  expect(send()).toHaveFocus();
});

test("a canceled nested click does not stop the focus of the outer submit", async () => {
  const user = userEvent.setup();

  render(
    <form data-testid="form" onSubmit={(e) => e.preventDefault()}>
      <Field.Root required>
        <Field.Label>First</Field.Label>
        <TextInput name="first" />
      </Field.Root>

      <button
        type="submit"
        onClick={() => screen.getByRole("button", { name: "Inner" }).click()}
      >
        Send
      </button>
      <button type="submit" onClick={(e) => e.preventDefault()}>
        Inner
      </button>
    </form>,
  );

  await user.click(send());

  await waitFor(() => expect(input("First")).toHaveFocus());
});

test("a nested click that submits still focuses when the outer one is canceled", async () => {
  const user = userEvent.setup();

  render(
    <form data-testid="form" onSubmit={(e) => e.preventDefault()}>
      <Field.Root required>
        <Field.Label>First</Field.Label>
        <TextInput name="first" />
      </Field.Root>

      <button
        type="submit"
        onClick={(e) => {
          screen.getByRole("button", { name: "Inner" }).click();
          e.preventDefault();
        }}
      >
        Send
      </button>
      <button type="submit">Inner</button>
    </form>,
  );

  await user.click(send());

  await waitFor(() => expect(input("First")).toHaveFocus());
});
