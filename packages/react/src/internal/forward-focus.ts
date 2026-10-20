import type { FocusEvent } from "react";

// Firefox focuses an invalid field and only then listens for its blur to hide the popup
export const forwardFocus =
  (focus: () => void) => (event: FocusEvent<HTMLElement>) => {
    const proxy = event.currentTarget;

    queueMicrotask(() => {
      if (proxy.ownerDocument.activeElement === proxy) focus();
    });
  };
