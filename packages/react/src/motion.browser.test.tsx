import { render, screen } from "@testing-library/react";
import { cdp, userEvent } from "vitest/browser";
import { Checkbox } from "./checkbox";
import { Popover } from "./popover";
import "./styles.css";

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const emulateReducedMotion = (value: "reduce" | "no-preference") =>
  cdp().send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value }],
  });

afterEach(async () => {
  document.documentElement.removeAttribute("data-bk-motion");
  await emulateReducedMotion("no-preference");
});

test("prefers-reduced-motion stops movement and keeps the fades", async () => {
  render(<Checkbox />);

  await emulateReducedMotion("reduce");

  expect(token("--bk-duration-move")).toBe("0s");
  expect(token("--bk-motion-scale")).toBe("1");
  expect(token("--bk-motion-shift")).toBe("0px");
  expect(token("--bk-motion-press")).toBe("1");

  expect(token("--bk-duration-base")).toBe("180ms");
  expect(token("--bk-duration-fast")).toBe("120ms");
});

test("the attribute does the same thing without the system preference", () => {
  render(<Checkbox />);

  document.documentElement.setAttribute("data-bk-motion", "off");

  expect(token("--bk-duration-move")).toBe("0s");
  expect(token("--bk-motion-scale")).toBe("1");
});

test("the checkbox mark still lands, it just does not animate", async () => {
  render(<Checkbox data-testid="cb" />);

  await emulateReducedMotion("reduce");

  const box = screen.getByTestId("cb");

  await userEvent.click(box);

  expect(getComputedStyle(box).backgroundSize).toBe("12px 12px");
});

test("an overlay under reduced motion opens at its final size", async () => {
  render(
    <Popover.Root>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content data-testid="content">Body</Popover.Content>
    </Popover.Root>,
  );

  await emulateReducedMotion("reduce");
  await userEvent.click(screen.getByRole("button", { name: "Open" }));

  const content = screen.getByTestId("content");

  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(
    getComputedStyle(content).transform,
  );
});
