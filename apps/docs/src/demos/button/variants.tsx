import { Button } from "@blankjs/react";

export const ButtonVariants = () => (
  <div style={{ display: "grid", gap: "0.75rem" }}>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button>Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>

    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button color="danger">Delete</Button>
      <Button color="danger" variant="outline">
        Delete
      </Button>
      <Button color="danger" variant="ghost">
        Delete
      </Button>
    </div>
  </div>
);
