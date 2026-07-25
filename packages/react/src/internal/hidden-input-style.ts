import type { CSSProperties } from "react";

// Inline rather than in the stylesheet: hiding the form proxy is behavior, not
// looks. Components must stay usable without styles.css, and a visible stray
// text input next to the trigger is a broken component, not an unstyled one.
export const HIDDEN_INPUT_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: -1,
  opacity: 0,
  pointerEvents: "none",
};
