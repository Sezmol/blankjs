import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Combobox } from "../combobox";
import { MultiSelect } from "../multi-select";
import { PinInput } from "../pin-input";
import { Select } from "../select";
import "../styles.css";

const controls = {
  PinInput: {
    control: <PinInput name="code" length={4} required />,
    visible: () => screen.getByLabelText("1 of 4"),
  },
  Select: {
    control: (
      <Select.Root name="choice" required>
        <Select.Trigger>Choose</Select.Trigger>
      </Select.Root>
    ),
    visible: () => screen.getByRole("combobox"),
  },
  Combobox: {
    control: (
      <Combobox.Root name="choice" required>
        <Combobox.Input aria-label="Search" />
      </Combobox.Root>
    ),
    visible: () => screen.getByRole("combobox"),
  },
  MultiSelect: {
    control: (
      <MultiSelect.Root name="choice" required>
        <MultiSelect.Trigger>Choose</MultiSelect.Trigger>
      </MultiSelect.Root>
    ),
    visible: () => screen.getByRole("combobox"),
  },
};

test.each(Object.entries(controls))(
  "a failed submit leaves no browser popup over the page under a %s",
  async (_, { control, visible }) => {
    render(
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ position: "relative" }}>{control}</div>
        <input aria-label="Below" style={{ display: "block", width: 100 }} />
        <button>Send</button>
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    await expect.poll(() => document.activeElement).toBe(visible());

    // Firefox draws the popup outside the page a bit later, so there is nothing to wait for
    await new Promise((resolve) => setTimeout(resolve, 300));

    await userEvent.click(screen.getByLabelText("Below"));

    expect(screen.getByLabelText("Below")).toHaveFocus();
  },
);
