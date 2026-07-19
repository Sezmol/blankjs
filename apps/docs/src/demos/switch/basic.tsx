import { useState } from "react";
import { Switch } from "@blankjs/react";

export const SwitchBasic = () => {
  const [on, setOn] = useState(true);

  return (
    <>
      <label className="demo-check">
        <Switch checked={on} onCheckedChange={setOn} />
        Notifications: {on ? "on" : "off"}
      </label>

      <label className="demo-check">
        <Switch size="sm" /> Small
      </label>

      <label className="demo-check">
        <Switch size="lg" defaultChecked /> Large
      </label>

      <label className="demo-check">
        <Switch disabled /> Disabled
      </label>
    </>
  );
};
