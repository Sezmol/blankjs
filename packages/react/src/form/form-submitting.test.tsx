import { act, fireEvent, render, screen } from "@testing-library/react";
import { Form } from "./form";

const deferred = () => {
  let resolve!: () => void;

  const promise = new Promise<void>((r) => {
    resolve = r;
  });

  return { promise, resolve };
};

test("a pending async submit blocks re-submits", async () => {
  const { promise, resolve } = deferred();
  const onSubmit = vi.fn(() => promise);

  render(
    <Form data-testid="form" onSubmit={onSubmit}>
      <button type="submit">Go</button>
    </Form>,
  );

  const form = screen.getByTestId("form");

  fireEvent.submit(form);
  fireEvent.submit(form);

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(form).toHaveAttribute("data-submitting");

  await act(async () => {
    resolve();
    await promise;
  });

  expect(form).not.toHaveAttribute("data-submitting");

  fireEvent.submit(form);
  expect(onSubmit).toHaveBeenCalledTimes(2);
});

test("a sync submit leaves no data-submitting behind", async () => {
  const onSubmit = vi.fn();

  render(
    <Form data-testid="form" onSubmit={onSubmit}>
      <button type="submit">Go</button>
    </Form>,
  );

  const form = screen.getByTestId("form");

  await act(async () => {
    fireEvent.submit(form);
  });

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(form).not.toHaveAttribute("data-submitting");
});

test("server errors focus the first matching control in DOM order", () => {
  render(
    <Form errors={{ email: "Already taken" }}>
      <input name="username" />
      <input name="email" />
    </Form>,
  );

  expect(document.activeElement).toHaveAttribute("name", "email");
});

test("an inline errors literal does not re-steal focus on rerender", () => {
  const { rerender } = render(
    <Form errors={{ email: "Already taken" }}>
      <input name="username" />
      <input name="email" />
    </Form>,
  );

  const username = document.querySelector<HTMLInputElement>(
    "[name='username']",
  )!;

  act(() => username.focus());

  rerender(
    <Form errors={{ email: "Already taken" }}>
      <input name="username" />
      <input name="email" />
    </Form>,
  );

  expect(document.activeElement).toBe(username);
});

test("new server errors move focus again", () => {
  const { rerender } = render(
    <Form errors={{ email: "Already taken" }}>
      <input name="username" />
      <input name="email" />
    </Form>,
  );

  rerender(
    <Form errors={{ username: "Too short" }}>
      <input name="username" />
      <input name="email" />
    </Form>,
  );

  expect(document.activeElement).toHaveAttribute("name", "username");
});
