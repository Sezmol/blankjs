import type { ComponentProps, ReactElement } from "react";
import { Slot } from "../slot";
import type { Size } from "../types";

export interface ButtonProps extends ComponentProps<"button"> {
  asChild?: boolean;
  variant?: "solid" | "outline" | "ghost";
  size?: Size;
}

export const Button = ({
  children,
  className,
  asChild,
  variant = "solid",
  size = "md",
  ...props
}: ButtonProps) => {
  const buttonProps = {
    type: "button" as const,
    ...props,
    className: ["bk-button", className].filter(Boolean).join(" "),
    "data-variant": variant,
    "data-size": size,
  };

  if (asChild) {
    return <Slot {...buttonProps}>{children as ReactElement}</Slot>;
  }

  return <button {...buttonProps}>{children}</button>;
};
