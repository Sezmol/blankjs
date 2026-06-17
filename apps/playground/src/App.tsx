import { Field } from "@blankjs/react";
import { useState } from "react";

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

        <Field.Control>
          <input type="text" placeholder="Enter your name" className="input" />
        </Field.Control>

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
