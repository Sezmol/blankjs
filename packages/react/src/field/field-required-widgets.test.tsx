import { render, screen, fireEvent } from "@testing-library/react";
import { Field } from "./index";
import { Select } from "../select";
import { Combobox } from "../combobox";
import { MultiSelect } from "../multi-select";
import { useState } from "react";

const getHiddenInput = (name: string) =>
  document.querySelector<HTMLInputElement>(`input[name="${name}"]`);

describe("required Select inside Field", () => {
  const renderSelect = () =>
    render(
      <form data-testid="form">
        <Field.Root required>
          <Field.Label>Country</Field.Label>
          <Select.Root name="country">
            <Select.Trigger>
              <Select.Value placeholder="Pick" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="a">Australia</Select.Item>
            </Select.Content>
          </Select.Root>
          <Field.Error match="valueMissing">Pick a country</Field.Error>
        </Field.Root>
      </form>,
    );

  test("hidden input carries required and is a validation candidate", () => {
    renderSelect();

    const input = getHiddenInput("country")!;

    expect(input).toBeRequired();
    expect(input.willValidate).toBe(true);
    expect(input.validity.valueMissing).toBe(true);
  });

  test("no required attribute leaks onto the trigger button", () => {
    renderSelect();

    expect(screen.getByRole("combobox")).not.toHaveAttribute("required");
  });

  test("reveals the error on invalid and clears it after selection", () => {
    renderSelect();

    fireEvent.invalid(getHiddenInput("country")!);

    expect(screen.getByText("Pick a country")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Australia" }));

    expect(screen.queryByText("Pick a country")).toBeNull();
  });

  test("forwards focus from the hidden input to the trigger", () => {
    renderSelect();

    fireEvent.focus(getHiddenInput("country")!);

    expect(screen.getByRole("combobox")).toHaveFocus();
  });
});

describe("required Combobox inside Field", () => {
  const Harness = () => {
    const [inputValue, setInputValue] = useState("");

    return (
      <form>
        <Field.Root required>
          <Field.Label>City</Field.Label>
          <Combobox.Root
            name="city"
            inputValue={inputValue}
            onInputValueChange={setInputValue}
          >
            <Combobox.Input placeholder="Search" />
            <Combobox.Content>
              <Combobox.Item value="ams">Amsterdam</Combobox.Item>
            </Combobox.Content>
          </Combobox.Root>
          <Field.Error match="valueMissing">Pick a city</Field.Error>
        </Field.Root>
      </form>
    );
  };

  test("validates the committed value, not the draft text", () => {
    render(<Harness />);

    const hidden = getHiddenInput("city")!;

    expect(hidden).toBeRequired();
    expect(hidden.validity.valueMissing).toBe(true);
    expect(screen.getByRole("combobox")).not.toHaveAttribute("required");
  });

  test("clears the revealed error after committing an item", () => {
    render(<Harness />);

    fireEvent.invalid(getHiddenInput("city")!);

    expect(screen.getByText("Pick a city")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.pointerDown(screen.getByRole("option", { name: "Amsterdam" }));

    expect(screen.queryByText("Pick a city")).toBeNull();
  });
});

describe("required MultiSelect inside Field", () => {
  const renderMultiSelect = () =>
    render(
      <form data-testid="form">
        <Field.Root required>
          <Field.Label>Fruits</Field.Label>
          <MultiSelect.Root name="fruits">
            <MultiSelect.Trigger>
              <MultiSelect.Value placeholder="Pick" />
            </MultiSelect.Trigger>
            <MultiSelect.Content>
              <MultiSelect.Item value="a">Apple</MultiSelect.Item>
            </MultiSelect.Content>
          </MultiSelect.Root>
          <Field.Error match="valueMissing">Pick at least one</Field.Error>
        </Field.Root>
      </form>,
    );

  const getAnchor = () =>
    document.querySelector<HTMLInputElement>(
      "input.bk-multi-select-hidden-input",
    )!;

  test("anchor input is required and empty without selection", () => {
    renderMultiSelect();

    expect(getAnchor()).toBeRequired();
    expect(getAnchor().validity.valueMissing).toBe(true);
  });

  test("selection satisfies the constraint and keeps FormData intact", () => {
    renderMultiSelect();

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));

    expect(getAnchor().validity.valueMissing).toBe(false);

    const formData = new FormData(
      screen.getByTestId("form") as HTMLFormElement,
    );

    expect(formData.getAll("fruits")).toEqual(["a"]);
  });

  test("clears the revealed error after picking a value", () => {
    renderMultiSelect();

    fireEvent.invalid(getAnchor());

    expect(screen.getByText("Pick at least one")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));

    expect(screen.queryByText("Pick at least one")).toBeNull();
  });
});
