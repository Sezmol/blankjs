import { useEffect, type ComponentProps } from "react";
import { useDialogContext } from "./context";

type DialogTitleProps = ComponentProps<"h2">;

export const DialogTitle = ({
  children,
  className,
  ...props
}: DialogTitleProps) => {
  const { registerTitle, titleId } = useDialogContext();

  useEffect(() => registerTitle(), [registerTitle]);

  return (
    <h2
      {...props}
      id={titleId}
      className={["bk-dialog-title", className].filter(Boolean).join(" ")}
    >
      {children}
    </h2>
  );
};

DialogTitle.displayName = "Dialog.Title";
