import { TextInput } from "@blankjs/react";

export const TextInputSizes = () => (
  <>
    <TextInput size="sm" placeholder="Small" />
    <TextInput placeholder="Medium" />
    <TextInput size="lg" placeholder="Large" />
    <TextInput placeholder="Disabled" disabled />
  </>
);
