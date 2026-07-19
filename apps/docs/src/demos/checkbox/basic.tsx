import { Checkbox } from "@blankjs/react";

export const CheckboxBasic = () => (
  <>
    <label className="demo-check">
      <Checkbox defaultChecked /> Remember me
    </label>

    <label className="demo-check">
      <Checkbox /> Subscribe to updates
    </label>

    <label className="demo-check">
      <Checkbox disabled /> Disabled
    </label>
  </>
);
