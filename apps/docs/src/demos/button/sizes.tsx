import { Button } from "@blankjs/react";

export const ButtonSizes = () => (
  <>
    <Button size="sm" variant="outline">
      Small
    </Button>
    <Button variant="outline">Medium</Button>
    <Button size="lg" variant="outline">
      Large
    </Button>
    <Button disabled>Disabled</Button>
  </>
);
