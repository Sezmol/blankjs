import type { ComponentProps, ReactElement } from "react";
import { Slot } from "../slot";
import type { Size } from "../types";

export interface ButtonProps extends ComponentProps<"button"> {
  asChild?: boolean;
  variant?: "solid" | "outline" | "ghost";
  color?: "accent" | "danger";
  size?: Size;
}

export const Button = ({
  children,
  className,
  asChild,
  variant = "solid",
  size = "md",
  color,
  ...props
}: ButtonProps) => {
  const buttonProps = {
    type: "button" as const,
    ...props,
    className: ["bk-button", className].filter(Boolean).join(" "),
    "data-variant": variant,
    "data-size": size,
    "data-color": color,
  };

  if (asChild) {
    return <Slot {...buttonProps}>{children as ReactElement}</Slot>;
  }

  return <button {...buttonProps}>{children}</button>;
};
