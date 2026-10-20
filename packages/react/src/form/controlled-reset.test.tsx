import { useState } from "react";
import { flushSync } from "react-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Checkbox } from "../checkbox";
import { Switch } from "../switch";
import { RadioGroup } from "../radio";
import { CheckboxGroup } from "../checkbox-group";

const Pinned = ({ fruit, agree }: { fruit: string; agree: boolean }) => (
  <form aria-label="f">
    <RadioGroup.Root
      name="fruit"
      aria-label="Fruit"
      value={fruit}
      onValueChange={() => {}}
    >
      <RadioGroup.Item value="apple" aria-label="apple" />
      <RadioGroup.Item value="banana" aria-label="banana" />
    </RadioGroup.Root>
    <Checkbox
      name="agree"
      aria-label="agree"
      checked={agree}
      onCheckedChange={() => {}}
    />
    <Switch
      name="news"
      aria-label="news"
      checked={agree}
      onCheckedChange={() => {}}
    />
  </form>
);

const form = () => screen.getByRole("form") as HTMLFormElement;

const radio = (name: string) =>
  screen.getByRole("radio", { name }) as HTMLInputElement;

const box = (name: string) =>
  screen.getByRole(name === "news" ? "switch" : "checkbox", {
    name,
  }) as HTMLInputElement;

test("a real reset keeps controlled values the parent does not change", async () => {
  const { rerender } = render(<Pinned fruit="apple" agree={false} />);

  rerender(<Pinned fruit="banana" agree />);

  form().reset();

  await waitFor(() => expect(radio("banana")).toBeChecked());
  expect(radio("apple")).not.toBeChecked();
  expect(box("agree")).toBeChecked();
  expect(box("news")).toBeChecked();

  const data = new FormData(form());

  expect(data.get("fruit")).toBe("banana");
  expect(data.get("agree")).toBe("on");
  expect(data.get("news")).toBe("on");
});

test("a real reset follows a parent that accepts the default", async () => {
  const Accepting = () => {
    const [fruit, setFruit] = useState<string | null>("banana");
    const [agree, setAgree] = useState(true);

    return (
      <form aria-label="f">
        <RadioGroup.Root
          name="fruit"
          aria-label="Fruit"
          value={fruit}
          onValueChange={setFruit}
          defaultValue="apple"
        >
          <RadioGroup.Item value="apple" aria-label="apple" />
          <RadioGroup.Item value="banana" aria-label="banana" />
        </RadioGroup.Root>
        <Checkbox
          name="agree"
          aria-label="agree"
          checked={agree}
          onCheckedChange={setAgree}
        />
      </form>
    );
  };

  render(<Accepting />);

  form().reset();

  await waitFor(() => expect(radio("apple")).toBeChecked());
  expect(radio("banana")).not.toBeChecked();
  expect(box("agree")).not.toBeChecked();
});

test("a real reset returns uncontrolled values to their defaults", async () => {
  render(
    <form aria-label="f">
      <RadioGroup.Root name="fruit" aria-label="Fruit" defaultValue="apple">
        <RadioGroup.Item value="apple" aria-label="apple" />
        <RadioGroup.Item value="banana" aria-label="banana" />
      </RadioGroup.Root>
      <Checkbox name="agree" aria-label="agree" />
    </form>,
  );

  radio("banana").click();
  box("agree").click();

  form().reset();

  await waitFor(() => expect(radio("apple")).toBeChecked());
  expect(box("agree")).not.toBeChecked();
});

test("a RadioGroup parent that takes the default synchronously keeps it", async () => {
  const Sync = () => {
    const [fruit, setFruit] = useState<string | null>("banana");

    return (
      <form aria-label="f">
        <RadioGroup.Root
          name="fruit"
          aria-label="Fruit"
          value={fruit}
          defaultValue="apple"
          onValueChange={(next) => flushSync(() => setFruit(next))}
        >
          <RadioGroup.Item value="apple" aria-label="apple" />
          <RadioGroup.Item value="banana" aria-label="banana" />
        </RadioGroup.Root>
      </form>
    );
  };

  render(<Sync />);

  form().reset();
  await new Promise((resolve) => setTimeout(resolve, 20));

  expect(radio("apple")).toBeChecked();
  expect(radio("banana")).not.toBeChecked();
});

test("a Checkbox parent that takes the default synchronously keeps it", async () => {
  const Sync = () => {
    const [agree, setAgree] = useState(true);

    return (
      <form aria-label="f">
        <Checkbox
          name="agree"
          aria-label="agree"
          checked={agree}
          onCheckedChange={(next) => flushSync(() => setAgree(next))}
        />
      </form>
    );
  };

  render(<Sync />);

  form().reset();
  await new Promise((resolve) => setTimeout(resolve, 20));

  expect(box("agree")).not.toBeChecked();
});

const fruitBox = (name: string) =>
  screen.getByRole("checkbox", { name }) as HTMLInputElement;

test("a CheckboxGroup parent that ignores the reset keeps its value", async () => {
  const pinned = (fruits: string[]) => (
    <form aria-label="f">
      <CheckboxGroup.Root
        name="fruit"
        aria-label="Fruit"
        value={fruits}
        onValueChange={() => {}}
      >
        <CheckboxGroup.Item value="apple" aria-label="apple" />
        <CheckboxGroup.Item value="banana" aria-label="banana" />
      </CheckboxGroup.Root>
    </form>
  );

  const { rerender } = render(pinned(["apple"]));

  rerender(pinned(["banana"]));

  form().reset();
  await new Promise((resolve) => setTimeout(resolve, 20));

  expect(fruitBox("apple")).not.toBeChecked();
  expect(fruitBox("banana")).toBeChecked();
  expect(new FormData(form()).getAll("fruit")).toEqual(["banana"]);
});

test("a CheckboxGroup parent that takes the default synchronously keeps it", async () => {
  const Sync = () => {
    const [fruits, setFruits] = useState(["banana"]);

    return (
      <form aria-label="f">
        <CheckboxGroup.Root
          name="fruit"
          aria-label="Fruit"
          value={fruits}
          defaultValue={["apple"]}
          onValueChange={(next) => flushSync(() => setFruits(next))}
        >
          <CheckboxGroup.Item value="apple" aria-label="apple" />
          <CheckboxGroup.Item value="banana" aria-label="banana" />
        </CheckboxGroup.Root>
      </form>
    );
  };

  render(<Sync />);

  form().reset();
  await new Promise((resolve) => setTimeout(resolve, 20));

  expect(fruitBox("apple")).toBeChecked();
  expect(fruitBox("banana")).not.toBeChecked();
});
