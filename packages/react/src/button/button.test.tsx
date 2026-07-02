import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, type ButtonProps } from "./button";

const renderButton = (props: ButtonProps = {}) =>
  render(<Button {...props}>Button</Button>);

test("renders type='button' by default", () => {
  renderButton();

  expect(screen.getByRole("button")).toHaveAttribute("type", "button");
});

test("lets a user-provided type override the default", () => {
  renderButton({ type: "submit" });

  expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
});

test("defaults variant and size to data-attributes", () => {
  renderButton();

  const button = screen.getByRole("button");

  expect(button).toHaveAttribute("data-variant", "solid");
  expect(button).toHaveAttribute("data-size", "md");
});

test("reflects explicit variant and size as data-attributes", () => {
  renderButton({ variant: "outline", size: "lg" });

  const button = screen.getByRole("button");

  expect(button).toHaveAttribute("data-variant", "outline");
  expect(button).toHaveAttribute("data-size", "lg");
});

test("merges props onto the child when asChild is set", () => {
  render(
    <Button asChild id="1">
      <a href="test">go</a>
    </Button>,
  );

  const link = screen.getByRole("link");

  expect(link).toHaveAttribute("href", "test");
  expect(link).toHaveAttribute("id", "1");
  expect(link).toHaveClass("bk-button");
  expect(link).toHaveAttribute("data-variant", "solid");
  expect(screen.queryByRole("button")).toBeNull();
});

test("merges a custom className with the base class", () => {
  renderButton({ className: "custom" });

  expect(screen.getByRole("button")).toHaveClass("bk-button", "custom");
});

test("does not fire onClick when disabled", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  renderButton({ disabled: true, onClick });

  const button = screen.getByRole("button");

  await user.click(button);

  expect(button).toBeDisabled();
  expect(onClick).not.toHaveBeenCalled();
});

test("fires onClick when clicked", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  renderButton({ onClick });

  await user.click(screen.getByRole("button"));

  expect(onClick).toHaveBeenCalledTimes(1);
});
