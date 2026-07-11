import { Checkbox } from "./checkbox";
import { Combobox } from "./combobox";
import { PasswordField } from "./password-field";
import { Switch } from "./switch";
import { TextInput } from "./text-input";
import { Textarea } from "./textarea";

test("void input components reject children at the type level", () => {
  const elements = [
    // @ts-expect-error children are not allowed on a void element
    <TextInput key="i">oops</TextInput>,
    // @ts-expect-error children are not allowed on a void element
    <PasswordField key="p">oops</PasswordField>,
    // @ts-expect-error React textareas take value, not children
    <Textarea key="t">oops</Textarea>,
    // @ts-expect-error children are not allowed on a void element
    <Checkbox key="c">oops</Checkbox>,
    // @ts-expect-error children are not allowed on a void element
    <Switch key="s">oops</Switch>,
  ];

  expect(elements).toHaveLength(5);
});

test("password field owns its type", () => {
  // @ts-expect-error type is controlled by the visibility toggle
  const el = <PasswordField type="text" />;

  expect(el).toBeTruthy();
});

test("native size attribute is not exposed", () => {
  const elements = [
    // @ts-expect-error size is the blankjs size prop, not the native attribute
    <TextInput key="i" size={20} />,
    <Combobox.Root key="c">
      {/* @ts-expect-error native size attribute is not exposed */}
      <Combobox.Input size={20} />
    </Combobox.Root>,
  ];

  expect(elements).toHaveLength(2);
});
