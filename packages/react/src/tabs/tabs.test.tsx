import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./index";

const renderTabs = (
  props: Partial<React.ComponentProps<typeof Tabs.Root>> = {},
) =>
  render(
    <Tabs.Root defaultValue="one" {...props}>
      <Tabs.List>
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
        <Tabs.Tab value="three">Three</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">First panel</Tabs.Panel>
      <Tabs.Panel value="two">Second panel</Tabs.Panel>
      <Tabs.Panel value="three">Third panel</Tabs.Panel>
    </Tabs.Root>,
  );

const tab = (name: string) => screen.getByRole("tab", { name });

test("wires ARIA between tabs and panels", () => {
  renderTabs();

  expect(screen.getByRole("tablist")).toBeInTheDocument();
  expect(tab("One")).toHaveAttribute("aria-selected", "true");
  expect(tab("Two")).toHaveAttribute("aria-selected", "false");

  const panel = screen.getByRole("tabpanel");

  expect(panel).toHaveTextContent("First panel");
  expect(tab("One")).toHaveAttribute("aria-controls", panel.id);
  expect(panel).toHaveAttribute("aria-labelledby", tab("One").id);
  expect(panel).toHaveAttribute("tabindex", "0");
});

test("hides inactive panels with hidden=until-found", () => {
  renderTabs();

  const hidden = screen.getByText("Second panel");

  expect(hidden.getAttribute("hidden")).toBe("until-found");
  expect(screen.getByText("First panel")).not.toHaveAttribute("hidden");
});

test("click selects a tab", async () => {
  const user = userEvent.setup();

  renderTabs();

  await user.click(tab("Two"));

  expect(tab("Two")).toHaveAttribute("aria-selected", "true");
  expect(screen.getByText("Second panel")).not.toHaveAttribute("hidden");
});

test("roving tabindex keeps one tab stop", () => {
  renderTabs();

  expect(tab("One")).toHaveAttribute("tabindex", "0");
  expect(tab("Two")).toHaveAttribute("tabindex", "-1");
  expect(tab("Three")).toHaveAttribute("tabindex", "-1");
});

test("arrows move focus and select in automatic mode", async () => {
  const user = userEvent.setup();

  renderTabs();

  await user.click(tab("One"));
  await user.keyboard("{ArrowRight}");

  expect(tab("Two")).toHaveFocus();
  expect(tab("Two")).toHaveAttribute("aria-selected", "true");
});

test("arrows loop at the edges", async () => {
  const user = userEvent.setup();

  renderTabs();

  await user.click(tab("One"));
  await user.keyboard("{ArrowLeft}");

  expect(tab("Three")).toHaveFocus();

  await user.keyboard("{ArrowRight}");

  expect(tab("One")).toHaveFocus();
});

test("Home and End jump to the first and last tab", async () => {
  const user = userEvent.setup();

  renderTabs();

  await user.click(tab("Two"));
  await user.keyboard("{End}");

  expect(tab("Three")).toHaveFocus();

  await user.keyboard("{Home}");

  expect(tab("One")).toHaveFocus();
});

test("manual mode moves focus without selecting", async () => {
  const user = userEvent.setup();

  renderTabs({ activationMode: "manual" });

  await user.click(tab("One"));
  await user.keyboard("{ArrowRight}");

  expect(tab("Two")).toHaveFocus();
  expect(tab("Two")).toHaveAttribute("aria-selected", "false");

  await user.keyboard("{Enter}");

  expect(tab("Two")).toHaveAttribute("aria-selected", "true");
});

test("disabled tabs are skipped by arrows", async () => {
  const user = userEvent.setup();

  render(
    <Tabs.Root defaultValue="one">
      <Tabs.List>
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two" disabled>
          Two
        </Tabs.Tab>
        <Tabs.Tab value="three">Three</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">First panel</Tabs.Panel>
      <Tabs.Panel value="two">Second panel</Tabs.Panel>
      <Tabs.Panel value="three">Third panel</Tabs.Panel>
    </Tabs.Root>,
  );

  await user.click(tab("One"));
  await user.keyboard("{ArrowRight}");

  expect(tab("Three")).toHaveFocus();
});

test("vertical orientation uses up and down arrows", async () => {
  const user = userEvent.setup();

  renderTabs({ orientation: "vertical" });

  expect(screen.getByRole("tablist")).toHaveAttribute(
    "aria-orientation",
    "vertical",
  );

  await user.click(tab("One"));
  await user.keyboard("{ArrowDown}");

  expect(tab("Two")).toHaveFocus();
});

test("onClick veto blocks selection", async () => {
  const user = userEvent.setup();

  render(
    <Tabs.Root defaultValue="one">
      <Tabs.List>
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two" onClick={(e) => e.preventDefault()}>
          Two
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">First panel</Tabs.Panel>
      <Tabs.Panel value="two">Second panel</Tabs.Panel>
    </Tabs.Root>,
  );

  await user.click(tab("Two"));

  expect(tab("One")).toHaveAttribute("aria-selected", "true");
});

test("works controlled", async () => {
  const user = userEvent.setup();

  const Controlled = () => {
    const [value, setValue] = useState("one");

    return (
      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>
    );
  };

  render(<Controlled />);

  await user.click(tab("Two"));

  expect(tab("Two")).toHaveAttribute("aria-selected", "true");
});

test("beforematch on a hidden panel activates its tab", () => {
  renderTabs();

  fireEvent(screen.getByText("Second panel"), new Event("beforematch"));

  expect(tab("Two")).toHaveAttribute("aria-selected", "true");
  expect(screen.getByText("Second panel")).not.toHaveAttribute("hidden");
});

test("tab inside a form does not submit it", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

  render(
    <form onSubmit={onSubmit}>
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>
    </form>,
  );

  await user.click(tab("Two"));

  expect(onSubmit).not.toHaveBeenCalled();
});
