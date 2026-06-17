import { cloneElement, type ReactElement } from "react";

export interface SlotProps extends Record<string, unknown> {
  children: ReactElement<{ className?: string }>;
  className?: string;
}

export const Slot = ({ children, className, ...props }: SlotProps) => {
  const merged = {
    ...props,
    className:
      [className, children.props.className].filter(Boolean).join(" ") ||
      undefined,
  };

  return cloneElement(children, merged);
};
