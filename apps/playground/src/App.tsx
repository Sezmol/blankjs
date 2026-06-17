import { Field, useFieldControlProps } from "@blankjs/react";
import { useState } from "react";

const Input = () => {
  const controlProps = useFieldControlProps();

  return <input {...controlProps} />;
};

function App() {
  const [invalid, setInvalid] = useState(false);

  return (
    <div style={{ padding: 40 }}>
      <Field.Root
        invalid={invalid}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "fit-content",
        }}
      >
        <Field.Label>Name</Field.Label>
        <Input />
        <Field.Description>Please enter your name</Field.Description>
        {invalid && <Field.Error>Name is required</Field.Error>}
      </Field.Root>

      <button onClick={() => setInvalid((v) => !v)} style={{ marginTop: 16 }}>
        toggle error
      </button>
    </div>
  );
}

export default App;
