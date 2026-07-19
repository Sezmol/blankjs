import { useState } from "react";
import { Checkbox } from "@blankjs/react";

const items = ["Bold", "Italic", "Underline"];

export const CheckboxIndeterminate = () => {
  const [checked, setChecked] = useState([true, false, false]);

  const allOn = checked.every(Boolean);
  const someOn = checked.some(Boolean);

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <label className="demo-check">
        <Checkbox
          checked={allOn}
          indeterminate={someOn && !allOn}
          onCheckedChange={(next) => setChecked(items.map(() => next))}
        />
        Text style
      </label>

      {items.map((item, i) => (
        <label className="demo-check" key={item} style={{ marginLeft: "1.5rem" }}>
          <Checkbox
            checked={checked[i]}
            onCheckedChange={(next) =>
              setChecked(checked.map((c, j) => (i === j ? next : c)))
            }
          />
          {item}
        </label>
      ))}
    </div>
  );
};
