import { useState } from "react";
import { PinInput } from "@blankjs/react";

export const PinInputBasic = () => {
  const [value, setValue] = useState("");

  return (
    <div className="demo-steps">
      <PinInput
        name="code"
        length={6}
        groups={[3, 3]}
        value={value}
        onValueChange={setValue}
      />

      <output>{value || "empty"}</output>
    </div>
  );
};
