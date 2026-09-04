import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Tabs } from "./index";
import "../styles.css";

const renderTabs = () =>
  render(
    <Tabs.Root defaultValue="one">
      <Tabs.List>
        <Tabs.Tab value="one">First</Tabs.Tab>
        <Tabs.Tab value="two">A much longer second tab</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">One</Tabs.Panel>
      <Tabs.Panel value="two">Two</Tabs.Panel>
    </Tabs.Root>,
  );

const indicator = () =>
  document.querySelector<HTMLElement>(".bk-tabs-indicator")!;

test("the indicator matches the active tab and follows it", async () => {
  renderTabs();

  const first = screen.getByRole("tab", { name: "First" });
  const second = screen.getByRole("tab", { name: "A much longer second tab" });

  await vi.waitFor(() => {
    expect(indicator().offsetLeft).toBe(first.offsetLeft);
    expect(indicator().offsetWidth).toBe(first.offsetWidth);
  });

  expect(second.offsetWidth).toBeGreaterThan(first.offsetWidth);

  await userEvent.click(second);

  await vi.waitFor(() => {
    expect(indicator().offsetLeft).toBe(second.offsetLeft);
    expect(indicator().offsetWidth).toBe(second.offsetWidth);
  });
});
