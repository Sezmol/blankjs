import { usePinInput } from "@blankjs/react";

export const PinInputHeadless = () => {
  const pin = usePinInput({ length: 4, type: "alphanumeric" });

  return (
    <div className="demo-steps">
      <div className="demo-row">
        {pin.chars.map((char, index) => (
          <input
            {...pin.getCellProps(index)}
            key={index}
            className="demo-pin-cell"
            data-filled={char ? "" : undefined}
            aria-label={`${index + 1} of ${pin.length}`}
          />
        ))}
      </div>

      <output>{pin.complete ? `complete: ${pin.value}` : "keep going"}</output>
    </div>
  );
};
