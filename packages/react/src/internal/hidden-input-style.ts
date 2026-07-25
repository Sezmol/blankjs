import type { CSSProperties } from "react";

export const HIDDEN_INPUT_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: -1,
  opacity: 0,
  pointerEvents: "none",
};
