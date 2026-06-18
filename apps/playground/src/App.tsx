import { Field, TextInput } from "@blankjs/react";
import "@blankjs/react/styles.css";
import { useState } from "react";

import "./index.css";

function App() {
  const [invalid, setInvalid] = useState(false);

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: "var(--bk-color-surface)",
        color: "var(--bk-color-text)",
        height: "100%",
      }}
    >
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
          <TextInput placeholder="Enter your name" />
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
