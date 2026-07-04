import { renderHook, act } from "@testing-library/react";
import type { CollectionItem } from "@blankjs/core";
import { useComboboxRoot } from "./use-combobox-root";

const makeItem = (
  value: string,
  label = value.toUpperCase(),
): CollectionItem<string> => ({
  node: document.createElement("div"),
  value,
  label,
  id: `opt-${value}`,
});

test("defaults to closed, empty values, enabled", () => {
  const { result } = renderHook(() => useComboboxRoot());

  expect(result.current.open).toBe(false);
  expect(result.current.value).toBeUndefined();
  expect(result.current.inputValue).toBe("");
  expect(result.current.activeItem).toBeUndefined();
  expect(result.current.disabled).toBe(false);
});

test("seeds value and inputValue from defaults", () => {
  const { result } = renderHook(() =>
    useComboboxRoot({ defaultValue: "a", defaultInputValue: "Apple" }),
  );

  expect(result.current.value).toBe("a");
  expect(result.current.inputValue).toBe("Apple");
});

test("commitItem sets value, inputValue and closes the list", () => {
  const { result } = renderHook(() => useComboboxRoot({ defaultOpen: true }));

  act(() => result.current.commitItem(makeItem("b", "Banana")));

  expect(result.current.value).toBe("b");
  expect(result.current.inputValue).toBe("Banana");
  expect(result.current.open).toBe(false);
});

test("revertInputValue restores the last committed label", () => {
  const { result } = renderHook(() => useComboboxRoot());

  act(() => result.current.commitItem(makeItem("a", "Apple")));
  act(() => result.current.setInputValue("asd"));
  act(() => result.current.revertInputValue());

  expect(result.current.inputValue).toBe("Apple");
});

test("revertInputValue falls back to defaultInputValue before any commit", () => {
  const { result } = renderHook(() =>
    useComboboxRoot({ defaultInputValue: "Apple" }),
  );

  act(() => result.current.setInputValue("asd"));
  act(() => result.current.revertInputValue());

  expect(result.current.inputValue).toBe("Apple");
});

test("revertInputValue falls back to empty string without defaults", () => {
  const { result } = renderHook(() => useComboboxRoot());

  act(() => result.current.setInputValue("asd"));
  act(() => result.current.revertInputValue());

  expect(result.current.inputValue).toBe("");
});

test("controlled value: commitItem notifies but does not own the state", () => {
  const onValueChange = vi.fn();
  const { result } = renderHook(() =>
    useComboboxRoot({ value: "a", onValueChange }),
  );

  act(() => result.current.commitItem(makeItem("b", "Banana")));

  expect(onValueChange).toHaveBeenCalledWith("b");
  expect(result.current.value).toBe("a");
  expect(result.current.open).toBe(false);
  expect(result.current.inputValue).toBe("Banana");
});

test("controlled inputValue: typing path notifies through onInputValueChange", () => {
  const onInputValueChange = vi.fn();
  const { result } = renderHook(() =>
    useComboboxRoot({ inputValue: "Apple", onInputValueChange }),
  );

  act(() => result.current.setInputValue("asd"));

  expect(onInputValueChange).toHaveBeenCalledWith("asd");
  expect(result.current.inputValue).toBe("Apple");
});

test("resetToDefault restores value, inputValue and committed label", () => {
  const { result } = renderHook(() =>
    useComboboxRoot({ defaultValue: "a", defaultInputValue: "Apple" }),
  );

  act(() => result.current.commitItem(makeItem("b", "Banana")));
  act(() => result.current.resetToDefault());

  expect(result.current.value).toBe("a");
  expect(result.current.inputValue).toBe("Apple");

  act(() => result.current.setInputValue("asd"));
  act(() => result.current.revertInputValue());
  expect(result.current.inputValue).toBe("Apple");
});

test("resetToDefault clears to undefined and empty string without defaults", () => {
  const { result } = renderHook(() => useComboboxRoot());

  act(() => result.current.commitItem(makeItem("b", "Banana")));
  act(() => result.current.resetToDefault());

  expect(result.current.value).toBeUndefined();
  expect(result.current.inputValue).toBe("");
});

test("keeps ids stable and unique across rerenders", () => {
  const { result, rerender } = renderHook(() => useComboboxRoot());

  const { inputId, listboxId } = result.current;

  expect(inputId).not.toBe(listboxId);

  rerender();

  expect(result.current.inputId).toBe(inputId);
  expect(result.current.listboxId).toBe(listboxId);
});

test("returns a referentially stable context when nothing changed", () => {
  const { result, rerender } = renderHook(() => useComboboxRoot());

  const oldResult = result.current;

  rerender();

  expect(oldResult).toBe(result.current);
});
