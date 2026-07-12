import type { ComponentProps, MouseEvent } from "react";
import { useDialogContext } from "./context";

type DialogCloseProps = ComponentProps<"button">;

export const DialogClose = ({
  className,
  onClick,
  children,
  ...props
}: DialogCloseProps) => {
  const { setOpen } = useDialogContext();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    setOpen(false);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={["bk-dialog-close", className].filter(Boolean).join(" ")}
      type="button"
    >
      {children}
    </button>
  );
};

DialogClose.displayName = "Dialog.Close";
